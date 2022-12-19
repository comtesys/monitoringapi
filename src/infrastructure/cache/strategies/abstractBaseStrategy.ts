import { IStorage } from "../storages/storage";

export abstract class AbstractBaseStrategy {
  constructor(protected storage: IStorage) {}

  public abstract getItem<T>(key: string): Promise<T>;
  public abstract setItem(key: string, content: any, options: any): Promise<void>;
  public abstract clear(): Promise<void>;
}
