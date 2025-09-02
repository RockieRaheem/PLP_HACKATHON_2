
import { openDB } from 'idb';

const DB_NAME = 'EduAidBot';
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('messages')) {
        const messagesStore = db.createObjectStore('messages', {
          keyPath: 'id',
          autoIncrement: true
        });
        messagesStore.createIndex('timestamp', 'timestamp');
        messagesStore.createIndex('synced', 'synced');
      }
    }
  });
};

export const saveOfflineMessage = async (message) => {
  const db = await initDB();
  return db.add('messages', {
    ...message,
    synced: false,
    timestamp: Date.now()
  });
};

export const getUnsynced Messages = async () => {
  const db = await initDB();
  return db.getAllFromIndex('messages', 'synced', false);
};