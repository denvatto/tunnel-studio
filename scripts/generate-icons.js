import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

// CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writePng(width, height, rgbaBuffer) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth 8
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(8 + len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const crc = crc32(buf.subarray(4, 8 + len));
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw image scanlines with filter byte 0
  const scanlines = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 4);
    scanlines[rowOffset] = 0; // None filter
    rgbaBuffer.copy(scanlines, rowOffset + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressedData = zlib.deflateSync(scanlines, { level: 9 });
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function drawTunnelIcon(size, isMaskable = false) {
  const buffer = Buffer.alloc(size * size * 4);
  const center = size / 2;
  const maxR = size / 2;

  // Background color: #0f1016 (RGB: 15, 16, 22)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const dx = x - center;
      const dy = y - center;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Base background
      let r = 15;
      let g = 17;
      let b = 24;
      let a = 255;

      // Draw rounded rect or circle background if not maskable
      if (!isMaskable) {
        const cornerRadius = size * 0.22;
        const qx = Math.abs(x - center) - (center - cornerRadius);
        const qy = Math.abs(y - center) - (center - cornerRadius);
        const inCorner = qx > 0 && qy > 0;
        if (inCorner) {
          const cornerDist = Math.sqrt(qx * qx + qy * qy);
          if (cornerDist > cornerRadius) {
            a = 0;
          } else if (cornerDist > cornerRadius - 1.5) {
            a = Math.round(255 * (cornerRadius - cornerDist) / 1.5);
          }
        }
      }

      if (a > 0) {
        // Subtle radial gradient vignette
        const normDist = dist / maxR;
        const vignette = Math.max(0, 1 - normDist * 0.5);
        r = Math.min(255, Math.round(r + 10 * (1 - normDist)));
        g = Math.min(255, Math.round(g + 14 * (1 - normDist)));
        b = Math.min(255, Math.round(b + 28 * (1 - normDist)));

        // Safe zone scaling factor for rings
        const scale = isMaskable ? 0.72 : 0.88;
        const dScaled = dist / scale;

        // Concentric tunnel studio rings: radii at 0.18, 0.32, 0.46, 0.60, 0.74 of size/2
        const rings = [
          { r: maxR * 0.18, width: size * 0.04, cr: 245, cg: 158, cb: 11 },   // amber core
          { r: maxR * 0.35, width: size * 0.035, cr: 168, cg: 85, cb: 247 },  // purple/violet
          { r: maxR * 0.52, width: size * 0.03, cr: 99, cg: 102, cb: 241 },   // indigo
          { r: maxR * 0.69, width: size * 0.025, cr: 56, cg: 189, cb: 248 },  // cyan
        ];

        for (const ring of rings) {
          const ringDist = Math.abs(dScaled - ring.r);
          if (ringDist < ring.width) {
            const intensity = Math.cos((ringDist / ring.width) * (Math.PI / 2));
            r = Math.round(r * (1 - intensity * 0.85) + ring.cr * intensity * 0.85);
            g = Math.round(g * (1 - intensity * 0.85) + ring.cg * intensity * 0.85);
            b = Math.round(b * (1 - intensity * 0.85) + ring.cb * intensity * 0.85);
          }
        }

        // Center sound pulse core
        if (dScaled < maxR * 0.12) {
          const coreIntensity = 1 - (dScaled / (maxR * 0.12));
          r = Math.round(r * (1 - coreIntensity) + 254 * coreIntensity);
          g = Math.round(g * (1 - coreIntensity) + 240 * coreIntensity);
          b = Math.round(b * (1 - coreIntensity) + 138 * coreIntensity);
        }
      }

      buffer[idx] = r;
      buffer[idx + 1] = g;
      buffer[idx + 2] = b;
      buffer[idx + 3] = a;
    }
  }

  return buffer;
}

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Generate 192x192 PNG
const png192 = writePng(192, 192, drawTunnelIcon(192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), png192);

// 2. Generate 512x512 PNG
const png512 = writePng(512, 512, drawTunnelIcon(512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), png512);

// 3. Generate 512x512 Maskable PNG
const png512Maskable = writePng(512, 512, drawTunnelIcon(512, true));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), png512Maskable);

// 4. Apple Touch Icon 180x180 PNG
const png180 = writePng(180, 180, drawTunnelIcon(180, false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);

// 5. SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="112" fill="#0c0d14"/>
  <circle cx="256" cy="256" r="196" stroke="#38bdf8" stroke-width="12" stroke-opacity="0.8"/>
  <circle cx="256" cy="256" r="148" stroke="#6366f1" stroke-width="14" stroke-opacity="0.85"/>
  <circle cx="256" cy="256" r="100" stroke="#a855f7" stroke-width="16" stroke-opacity="0.9"/>
  <circle cx="256" cy="256" r="54" stroke="#f59e0b" stroke-width="18"/>
  <circle cx="256" cy="256" r="22" fill="#fef08a"/>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf-8');

console.log('PWA icons successfully generated in /public');
