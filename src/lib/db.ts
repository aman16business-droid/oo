import { openDB, IDBPDatabase } from 'idb';

const DATABASE_NAME = 'site_assets_db';
const STORE_NAME = 'assets';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DATABASE_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  }
  return dbPromise;
}

export async function saveAsset(key: string, blob: Blob | string): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, blob, key);
}

export async function getAsset(key: string): Promise<Blob | string | undefined> {
  const db = await getDB();
  return db.get(STORE_NAME, key);
}

export async function removeAsset(key: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, key);
}
