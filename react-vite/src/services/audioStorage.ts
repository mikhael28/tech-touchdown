/**
 * IndexedDB service for storing podcast recordings
 * Provides persistent storage for audio files and metadata
 */

export interface AudioRecording {
  id: string;
  name: string;
  blob: Blob;
  duration: number;
  createdAt: number;
  size: number;
  mimeType: string;
}

const DB_NAME = 'TechTouchdownPodcastDB';
const DB_VERSION = 1;
const STORE_NAME = 'recordings';

class AudioStorageService {
  private db: IDBDatabase | null = null;

  /**
   * Initialize the IndexedDB database
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          objectStore.createIndex('createdAt', 'createdAt', { unique: false });
          objectStore.createIndex('name', 'name', { unique: false });
        }
      };
    });
  }

  /**
   * Save an audio recording to IndexedDB
   */
  async saveRecording(recording: AudioRecording): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(recording);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to save recording'));
    });
  }

  /**
   * Get all recordings from IndexedDB
   */
  async getAllRecordings(): Promise<AudioRecording[]> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const recordings = request.result as AudioRecording[];
        // Sort by creation date, newest first
        recordings.sort((a, b) => b.createdAt - a.createdAt);
        resolve(recordings);
      };
      request.onerror = () => reject(new Error('Failed to get recordings'));
    });
  }

  /**
   * Get a specific recording by ID
   */
  async getRecording(id: string): Promise<AudioRecording | null> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(new Error('Failed to get recording'));
    });
  }

  /**
   * Delete a recording from IndexedDB
   */
  async deleteRecording(id: string): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to delete recording'));
    });
  }

  /**
   * Update a recording's metadata (e.g., rename)
   */
  async updateRecording(id: string, updates: Partial<AudioRecording>): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    const recording = await this.getRecording(id);
    if (!recording) {
      throw new Error('Recording not found');
    }

    const updatedRecording = { ...recording, ...updates, id }; // Ensure ID doesn't change
    return this.saveRecording(updatedRecording);
  }

  /**
   * Clear all recordings (useful for cleanup)
   */
  async clearAllRecordings(): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to clear recordings'));
    });
  }

  /**
   * Get total storage size used by recordings
   */
  async getStorageSize(): Promise<number> {
    const recordings = await this.getAllRecordings();
    return recordings.reduce((total, recording) => total + recording.size, 0);
  }
}

// Export singleton instance
export const audioStorage = new AudioStorageService();
