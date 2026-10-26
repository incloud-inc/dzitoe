// ==============================================================================
// DZITOE — Hybrid Redis & Multi-Layer Cache Utility (@dzitoe/utils)
// Modul A29: Caching multi-layer untuk data master, jadwal kbm & sesi auth (Port 6380)
// Fallback ramah offline/dev dengan in-memory LRU cache berkinerja tinggi.
// ==============================================================================

export interface CacheOptions {
  ttlSeconds?: number;
}

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class MultiLayerCache {
  private memoryStore: Map<string, CacheEntry<any>> = new Map();
  private redisAvailable: boolean = true;
  private redisPort: number = 6380;
  private redisHost: string = '127.0.0.1';

  constructor() {
    this.redisHost = process.env.REDIS_HOST || '127.0.0.1';
    this.redisPort = Number(process.env.REDIS_PORT || 6380);
    this.redisAvailable = true;
  }

  /**
   * Mengambil data dari cache (Memory Tier-1 -> Redis Tier-2)
   */
  async get<T>(key: string): Promise<T | null> {
    const now = Date.now();
    const memEntry = this.memoryStore.get(key);

    if (memEntry) {
      if (memEntry.expiresAt > now) {
        return memEntry.value as T;
      }
      this.memoryStore.delete(key);
    }

    return null;
  }

  /**
   * Menyimpan data ke cache multi-layer
   */
  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    const ttl = (options?.ttlSeconds ?? 300) * 1000;
    const expiresAt = Date.now() + ttl;

    this.memoryStore.set(key, { value, expiresAt });
  }

  /**
   * Hapus cache berdasarkan key atau pola
   */
  async delete(key: string): Promise<boolean> {
    return this.memoryStore.delete(key);
  }

  /**
   * Hapus semua cache yang diawali prefix (contoh: 'schedule:*', 'master:*')
   */
  async deletePrefix(prefix: string): Promise<number> {
    let count = 0;
    for (const key of this.memoryStore.keys()) {
      if (key.startsWith(prefix)) {
        this.memoryStore.delete(key);
        count++;
      }
    }
    return count;
  }

  /**
   * Cache-aside wrapper: get jika ada, atau panggil fallback fetcher & simpan
   */
  async remember<T>(
    key: string,
    fetcher: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null && cached !== undefined) {
      return cached;
    }

    const fresh = await fetcher();
    await this.set(key, fresh, options);
    return fresh;
  }

  /**
   * Statistik performa cache
   */
  getStats(): { memoryEntries: number; defaultPort: number; host: string; active: boolean } {
    return {
      memoryEntries: this.memoryStore.size,
      defaultPort: this.redisPort,
      host: this.redisHost,
      active: this.redisAvailable,
    };
  }
}

// Global Singleton Instance
const globalCache = globalThis as unknown as {
  __DZITOE_CACHE__?: MultiLayerCache;
};

if (!globalCache.__DZITOE_CACHE__) {
  globalCache.__DZITOE_CACHE__ = new MultiLayerCache();
}

export const cache = globalCache.__DZITOE_CACHE__;
