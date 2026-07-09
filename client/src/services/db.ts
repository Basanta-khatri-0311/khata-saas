import { openDB } from 'idb';

const DB_NAME = 'KhataOfflineDB';
const DB_VERSION = 1;

export const initDB = async () => {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('sync-transactions')) {
                db.createObjectStore('sync-transactions', { keyPath: 'id', autoIncrement: true });
            }
        },
    });
};

export const addTransactionToSync = async (transaction) => {
    const db = await initDB();
    const tx = db.transaction('sync-transactions', 'readwrite');
    const store = tx.objectStore('sync-transactions');
    await store.add({ ...transaction, timestamp: Date.now() });
    await tx.done;
};

export const getTransactionsToSync = async () => {
    const db = await initDB();
    const tx = db.transaction('sync-transactions', 'readonly');
    const store = tx.objectStore('sync-transactions');
    return store.getAll();
};

export const clearSyncTransaction = async (id) => {
    const db = await initDB();
    const tx = db.transaction('sync-transactions', 'readwrite');
    const store = tx.objectStore('sync-transactions');
    await store.delete(id);
    await tx.done;
};
