// IndexedDB service for managing show schedules

import { Show } from '../types/show';

const DB_NAME = 'TechTouchdownDB';
const SHOWS_STORE = 'shows';
const DB_VERSION = 2; // Incremented to add new object store

export interface SavedShow extends Show {
  createdAt: Date;
  updatedAt: Date;
  source: 'generated' | 'manual' | 'edited';
  generationParams?: {
    summary: string;
    favoriteIds: string[];
    timestamp: Date;
  };
}

class ShowsDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create shows object store if it doesn't exist
        if (!db.objectStoreNames.contains(SHOWS_STORE)) {
          const objectStore = db.createObjectStore(SHOWS_STORE, { keyPath: 'id' });
          objectStore.createIndex('createdAt', 'createdAt', { unique: false });
          objectStore.createIndex('updatedAt', 'updatedAt', { unique: false });
          objectStore.createIndex('airDate', 'airDate', { unique: false });
          objectStore.createIndex('status', 'status', { unique: false });
        }

        // Keep the existing favorites store
        if (!db.objectStoreNames.contains('favorites')) {
          const favoritesStore = db.createObjectStore('favorites', { keyPath: 'id' });
          favoritesStore.createIndex('savedAt', 'savedAt', { unique: false });
          favoritesStore.createIndex('url', 'url', { unique: true });
        }
      };
    });
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) {
      throw new Error('Failed to initialize database');
    }
    return this.db;
  }

  async saveShow(show: Show, params?: SavedShow['generationParams']): Promise<SavedShow> {
    const db = await this.ensureDB();
    
    const now = new Date();
    const savedShow: SavedShow = {
      ...show,
      createdAt: now,
      updatedAt: now,
      source: params ? 'generated' : 'manual',
      generationParams: params,
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SHOWS_STORE], 'readwrite');
      const store = transaction.objectStore(SHOWS_STORE);
      const request = store.put(savedShow);

      request.onsuccess = () => {
        resolve(savedShow);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async updateShow(show: SavedShow): Promise<SavedShow> {
    const db = await this.ensureDB();
    
    const updatedShow: SavedShow = {
      ...show,
      updatedAt: new Date(),
      source: 'edited',
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SHOWS_STORE], 'readwrite');
      const store = transaction.objectStore(SHOWS_STORE);
      const request = store.put(updatedShow);

      request.onsuccess = () => {
        resolve(updatedShow);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async getShow(id: string): Promise<SavedShow | undefined> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SHOWS_STORE], 'readonly');
      const store = transaction.objectStore(SHOWS_STORE);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async getAllShows(): Promise<SavedShow[]> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SHOWS_STORE], 'readonly');
      const store = transaction.objectStore(SHOWS_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        // Sort by updatedAt descending (most recent first)
        const results = request.result.sort(
          (a: SavedShow, b: SavedShow) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        resolve(results);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async deleteShow(id: string): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SHOWS_STORE], 'readwrite');
      const store = transaction.objectStore(SHOWS_STORE);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async clearAllShows(): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SHOWS_STORE], 'readwrite');
      const store = transaction.objectStore(SHOWS_STORE);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }
}

// Export singleton instance
export const showsDB = new ShowsDB();

