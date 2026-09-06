import { TimelineBlock } from '../types';

const DB_NAME = 'tunnel_studio_db';
const DB_VERSION = 1;
const STORE_NAME = 'timeline_blocks';
const CANVAS_RECORD_ID = 'primary_canvas_sequence';

interface CanvasRecord {
  id: string;
  blocks: TimelineBlock[];
  updatedAt: number;
}

/**
 * Open or upgrade the Tunnel Studio IndexedDB database
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB is not supported in this environment'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Could not open IndexedDB'));
    };
  });
}

/**
 * Persist the current sequence of timeline blocks to IndexedDB
 */
export async function saveTimelineToDB(blocks: TimelineBlock[]): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const record: CanvasRecord = {
        id: CANVAS_RECORD_ID,
        blocks,
        updatedAt: Date.now(),
      };

      const request = store.put(record);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('IndexedDB save failed:', error);
  }
}

/**
 * Load the saved sequence of timeline blocks from IndexedDB
 */
export async function loadTimelineFromDB(): Promise<TimelineBlock[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);

      const request = store.get(CANVAS_RECORD_ID);

      request.onsuccess = () => {
        const result = request.result as CanvasRecord | undefined;
        if (result && Array.isArray(result.blocks)) {
          resolve(result.blocks);
        } else {
          resolve([]);
        }
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.warn('IndexedDB load failed:', error);
    return [];
  }
}

/**
 * Clear the stored sequence from IndexedDB
 */
export async function clearTimelineInDB(): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const request = store.delete(CANVAS_RECORD_ID);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('IndexedDB clear failed:', error);
  }
}
