import { BehaviorSubject, Observable, Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { Entity } from "./entity";
import { EntityService } from "./entity.service";
import { RequestOptions } from "./request-options";

/**
 * The Query Data keeps track of each query and associated reponses.
 * This includes the time the query expires, and all of the entities
 * that were returned from this query. This is used by the cache to
 * manage reqeat queries within the query's expiry time.
 *
 * @typeParam T The kind of entity returned by the query.
 */
class QueryData<T> {
  /**
   * The URI path used to query the server.
   */
  public pathKey: string;

  /**
   * The time that this query will expire.
   */
  public expireAt: Date;

  /**
   * The entity objects that were returned from the query.
   */
  public response: T[];

  /**
   * Creates a new QueryData object for the indicated path, time, and response.
   *
   * @param pathKey The URI path used to query the server.
   * @param ttl the time to live for the query.
   * @param data the response from the query
   */
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

/**
 * The Entity Cache is used to store the results of queries made to the server.
 * Each query made, and its response objects, will be stored in the cache. Repeating
 * a query within the cache's expiry time will return the cached response, and not
 * make the request to the server.
 *
 * @typeParam T The kind of entity stored in the cache.
 */
export class EntityCache<T extends Entity> {
  /**
   * The data store for the cache.
   */
  private cache: Map<string, T> = new Map<string, T>();

  /**
   * All of the queries made to the server, and their associated responses.
   */
  private queryKeys: Map<string, QueryData<T>> = new Map<string, QueryData<T>>();

  /**
   * The time to live for all queries in the cache. This defaults to 24 hours.
   * Time is in milliseconds.
   */
  private cacheExpiryTime: number = 86400000; // 24 hours

  /**
   * The subject used to emit events that occur when the cache changes.
   */
  private cacheSubject: Subject<T[]> = new BehaviorSubject<T[]>( [] );

  /**
   * When true, dont announce via the cache subject, but do update the cache.
   */
  private dontAnnounce: boolean = false;

  /**
   * The time to live for all queries in the cache. This defaults to 24 hours.
   */
  public get cacheExpiryMilliseconds() {
    return this.cacheExpiryTime;
  }

  /**
   * Change the time to live for all future queries. This defaults to 24 hours.
   */
  public set cacheExpiryMilliseconds(value: number) {
    this.cacheExpiryTime = value;
  }

  /**
   * Fetch an Entity from the cache using its key.
   *
   * @param key the key for the entity
   * @returns the entity associated with the key, or undefined if not found.
   */
  public get(key: string) : T | undefined {
    return this.cache.get(key);
  }

  /**
   * Indicates if the cache has a value for the key.
   *
   * @param key the key for the entity to check.
   * @returns true if the cache contains an entity with that key
   */
  public has(key: string) : boolean {
    return this.cache.has(key);
  }

  /**
   * Add an entity to the cache.
   *
   * @param entity the entity to add to the cache.
   */
  public add(entity: T) {
    this.set(entity.key, entity);

    if ( !this.dontAnnounce ) {
      this.cacheSubject.next(this.currentValues);
    }
  }

  /**
   * Retrieve an object from the cache, or create it using the passed in data.
   *
   * @param key the key for the entity to find or create (must also be present in the data in case of object creation)
   * @param service the service associated with the creation of these entities
   * @param data the json data to pass to the object when created
   * @param mapParams the map params to pass to the object when created
   * @returns
   */
  public getOrCreate(key: string, service: EntityService<T>, data: object, mapParams?: any) {
    let entity: T;
    if ( this.has(key) ) {
      entity = this.get(key) as T;
    } else {
      entity = service.buildInstance(data, mapParams);
      this.add(entity);
    }

    return entity;
  }

  /**
   * Return an observable that publishes all changes to the cache.
   */
  public get values() : Observable<T[]> {
    return this.cacheSubject;
  }

  /**
   * Returns all values in the cache
   */
  public get currentValues(): T[] {
    return Array.from(this.cache.values());
  }

  /**
   * Stores or updates an entity within the cache.
   *
   * @param key the key for the entity to store
   * @param entity the entity to store in the cache
   */
  public set(key: string, entity: T) {
    this.cache.set(key, entity);

    if ( !this.dontAnnounce ) {
      this.cacheSubject.next(this.currentValues);
    }
  }

  /**
   * Remove an entity from the cache, based on its key.
   *
   * @param entity is either the key of entity, or the entity itself, to remove from cache
   * @returns true on success
   */
  public delete(entity: string | T) : boolean {
    let key: string;
    if ( typeof entity === "string" ) {
      key = entity;
    } else {
      key = entity.key;
    }

    const result = this.cache.delete(key);
    if (result && !this.dontAnnounce) {
      this.cacheSubject.next(this.currentValues);
    }

    return result;
  }

  /**
   * Returns the number of entities in the cache.
   */
  public get size(): number {
    return this.cache.size;
  }

  /**
   * Clears the cache and all of its queries.
   */
  public clear() : void {
    this.cache.clear();
    this.queryKeys.clear();
    this.cacheSubject.next([]);
  }

  /**
   * Registers a query with the cache. The query values will be stored in the cache along
   * with the query details. If the query is run again then the previous response will be returned.
   *
   * @param pathKey the path for the query
   * @param response the observer of the data returned from the query
   * @returns the observer of the response
   */
  public registerQuery(pathKey: string, response: Observable<T[]>): Observable<T[]> {
    return response.pipe(
      tap((entityList) => {
        // Dont announce all intermediate changes... just the final one.
        this.dontAnnounce = true;
        this.queryKeys.set(pathKey, new QueryData(pathKey, this.cacheExpiryTime, entityList));

        entityList.forEach((entity) => {
          this.set(entity.key, entity);
        });

        // Finished... so now announce all changes.
        this.dontAnnounce = false;
        this.cacheSubject.next(this.currentValues);
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
   * Creates a observable response for an array of values from the cache.
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

  /**
   * Creates a observable response for a value in the cache.
   *
   * @param queryKey the query
   * @param options any options the accompany the query
   * @returns an observer with the required objects
   */
   public observerForGet(queryKey: string, options?: RequestOptions<T>): Observable<T> {
    const data : QueryData<T> | undefined = this.queryKeys.get(queryKey);

    return new Observable((observer: any) => {
      observer.next(data?.response);
    });
  }
}
