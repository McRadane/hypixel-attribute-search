import Dexie from 'dexie';

import { getAuctionData, IAuctionsAPI } from './axios';

interface ICache {
  key: string;
  value: unknown;
}

export class Database extends Dexie {
  auctions!: Dexie.Table<IAuctionsAPI, string>;
  cache!: Dexie.Table<ICache, string>;

  private _cacheDuration = -1;
  private _initialized = false;
  private _lastRefresh = -1;
  private _polling!: number;

  constructor() {
    super('Hypixel');

    this.version(1).stores({
      auctions: 'uuid',
      cache: 'key'
    });
  }

  public async addToCache(key: string, value: unknown) {
    await this.ensureInitialize();
    const exists = await this.cache.get(key);
    if (exists) {
      this.cache.update(key, { value });
    } else {
      this.cache.add({ key, value });
    }
  }

  public set cacheDuration(duration: number | undefined) {
    if (duration === undefined) {
      this._cacheDuration = -1;
      this._stopPolling();
    } else {
      this._cacheDuration = duration;
      this._startPolling();
    }
  }

  public async ensureInitialize() {
    if (this._initialized) {
      return;
    }

    const lastRefreshString = await this.cache.get('lastRefresh');

    if (lastRefreshString) {
      const lastRefresh = Number(lastRefreshString.value);
      if (!Number.isNaN(lastRefresh)) {
        this._lastRefresh = lastRefresh;
      }
    }

    this._initialized = true;
  }

  public async getAuctions(): Promise<IAuctionsAPI[]> {
    await this.ensureInitialize();

    return new Promise<IAuctionsAPI[]>((resolve, reject) => {
      this.auctions
        .toArray()
        .then((array) => {
          if (array.length > 0) {
            resolve(array);
          } else {
            const interval = setInterval(async () => {
              const newArray = await this.auctions.toArray();
              if (newArray.length > 0) {
                clearInterval(interval);
                resolve(newArray);
              }
            }, 100);
          }
        })
        .catch((reason) => reject(reason));
    });
  }

  private _doPolling() {
    const now = Date.now();
    if (this._lastRefresh + this._cacheDuration < now) {
      this._lastRefresh = now;

      this.addToCache('lastRefresh', now);

      this._refresh();
    }
  }

  private async _refresh() {
    const auctions = await getAuctionData();
    await this.auctions.clear();
    await this.auctions.bulkAdd(auctions);
  }

  private _startPolling() {
    if (!this._polling && this._cacheDuration !== -1) {
      this._polling = setInterval(() => {
        this._doPolling();
      }, 1000) as unknown as number;
    }
  }

  private _stopPolling() {
    if (this._polling) {
      clearInterval(this._polling);
    }
  }
}
