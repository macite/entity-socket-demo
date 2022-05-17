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

  /**
   * Indicates if this query response data has passed its
   * cache duration.
   *
   * @returns false if the query data is still valid to use.
   */
  public get hasExpired() : boolean {
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

  /**
   * Has this query been run already?
   *
   * @param pathKey the query path
   * @returns true if the query has been run, and has not expired.
   */
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

  /**
   * Creates a observable response for a value in the cache.
   *
   * This uses `onCacheHitReturn` to determine if all objects from the cache are returned, or only those that were in the
   * original query. By default, all are returned if there are no query parameters in the original request (eg. /api/campus vs /api/campus?name=fred).
   *
   * @param queryKey the query
   * @param options any options the accompany the query
   * @returns an observer with the required objects
   */
  public observerFor(queryKey: string, options?: RequestOptions<T>): Observable<T[]> {
    const data : QueryData<T> | undefined = this.queryKeys.get(queryKey);
    const cache = this.cache;

    return new Observable((observer: any) => {
      if (options?.onCacheHitReturn === 'all' || (options?.onCacheHitReturn === undefined && !options?.params?.toString().length)) {
        observer.next([...cache.values()]);
      } else {
        observer.next(data?.response);
      }
    });
  }
}
