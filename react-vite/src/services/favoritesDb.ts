// IndexedDB service for managing favorite articles

import { ExaSearchResult } from '../types/exa';

const DB_NAME = 'TechTouchdownDB';
const STORE_NAME = 'favorites';
const DB_VERSION = 2; // Updated to match showsDb version

export interface FavoriteArticle extends ExaSearchResult {
  id: string; // Unique ID based on URL
  savedAt: Date;
}

class FavoritesDB {
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
        
        // Create favorites object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          objectStore.createIndex('savedAt', 'savedAt', { unique: false });
          objectStore.createIndex('url', 'url', { unique: true });
        }

        // Create shows object store if it doesn't exist (from showsDb)
        if (!db.objectStoreNames.contains('shows')) {
          const showsStore = db.createObjectStore('shows', { keyPath: 'id' });
          showsStore.createIndex('createdAt', 'createdAt', { unique: false });
          showsStore.createIndex('updatedAt', 'updatedAt', { unique: false });
          showsStore.createIndex('airDate', 'airDate', { unique: false });
          showsStore.createIndex('status', 'status', { unique: false });
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

  async addFavorite(article: ExaSearchResult): Promise<FavoriteArticle> {
    const db = await this.ensureDB();
    
    const favorite: FavoriteArticle = {
      ...article,
      id: this.generateId(article.url),
      savedAt: new Date(),
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(favorite);

      request.onsuccess = () => {
        resolve(favorite);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async removeFavorite(id: string): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async getAllFavorites(): Promise<FavoriteArticle[]> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        // Sort by savedAt descending (most recent first)
        const results = request.result.sort(
          (a: FavoriteArticle, b: FavoriteArticle) => 
            new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
        );
        resolve(results);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async isFavorite(url: string): Promise<boolean> {
    const db = await this.ensureDB();
    const id = this.generateId(url);

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result !== undefined);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async clearAllFavorites(): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  private generateId(url: string): string {
    // Simple hash function to create a consistent ID from URL
    return btoa(url).replace(/[^a-zA-Z0-9]/g, '');
  }
}

// Export singleton instance
export const favoritesDB = new FavoritesDB();

