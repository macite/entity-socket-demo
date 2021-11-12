import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Entity } from "./entity";
import { RequestOptions } from "./request-options";

class QueryData<T> {
  public pathKey: string;
  public expireAt: Date;
  public response: T[];

  public constructor(pathKey: string, ttl: number, data: T[]) {
    this.pathKey = pathKey;
    this.expireAt = new Date(new Date().getTime() + ttl);
    this.response = data;
  }

  public get hasExpired() {
    // Using get time here for clarity...
    // The Query has expired if the current time is larger than the expire at time
    return new Date().getTime() > this.expireAt.getTime();
  }

}

export class EntityCache<T extends Entity> {
  private cache: Map<string, T> = new Map<string, T>();
  private queryKeys: Map<string, QueryData<T>> = new Map<string, QueryData<T>>();
  private cacheExpiryTime: number = 86400000; // 24 hours

  public get cacheExpiryMilliseconds() {
    return this.cacheExpiryTime;
  }

  public set cacheExpiryMilliseconds(value: number) {
    this.cacheExpiryTime = value;
  }

  public get(key: string) : T | undefined {
    return this.cache.get(key);
  }

  public has(key: string) : boolean {
    return this.cache.has(key);
  }

  public set(key: string, entity: T) {
    this.cache.set(key, entity);
  }

  public delete(key: string) : boolean {
    return this.cache.delete(key);
  }

  public get size(): number {
    return this.cache.size;
  }

  public registerQuery(pathKey: string, response: Observable<T[]>): Observable<T[]> {
    return response.pipe(
      tap((entityList) => {
        this.queryKeys.set(pathKey, new QueryData(pathKey, this.cacheExpiryTime, entityList));
        entityList.forEach((entity) => {
          this.set(entity.key, entity);
        });
      })
    );
  }

  public ranQuery(pathKey: string) {
    if ( this.queryKeys.has(pathKey) ) {
      const data : QueryData<T> | undefined = this.queryKeys.get(pathKey);
      if ( data?.hasExpired ) {
        this.queryKeys.delete(pathKey);
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  public observerFor(queryKey: string, options?: RequestOptions<T>): Observable<T[]> {
    const data : QueryData<T> | undefined = this.queryKeys.get(queryKey);
    const cache = this.cache;

    return new Observable((observer: any) => {
      if (options?.onCacheHitReturn === 'all' || (options?.onCacheHitReturn === undefined && !options?.params?.toString().length)) {
        observer.next(cache.values());
      } else {
        observer.next(data?.response);
      }
    });
  }
}
