import { IStorage } from "./storage";

export class MemoryStorage implements IStorage {
  private memCache: any = {};

  constructor() {}

  public async getItem<T>(key: string): Promise<T> {
    return this.memCache[key];
  }

  public async setItem(key: string, content: any): Promise<void> {
    this.memCache[key] = content;
  }

  public async clear(): Promise<void> {
    this.memCache = {};
  }
}
