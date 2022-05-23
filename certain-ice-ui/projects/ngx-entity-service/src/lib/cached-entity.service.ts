import { EntityService } from './entity.service';
import { Entity } from './entity';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { EntityCache } from './entity-cache';
import { RequestOptions } from './request-options';
import { HttpParams, HttpParamsOptions } from '@angular/common/http';

/**
 * The CachedEntityService provides wraps the EntityService and provides a cache that stores
 * previously fetched entity objects from the server. Objects within the cache are updated when
 * new values are fetched from the server.
 */
export abstract class CachedEntityService<T extends Entity> extends EntityService<T> {
  private globalCache: EntityCache<T> = new EntityCache<T>();

  /**
   * Retrieve the cache object to use for the request.
   *
   * @param options The options of the request.
   * @returns The cache object to use.
   */
  private cacheFor(options?: RequestOptions<T>) : EntityCache<T> {
    return options?.cache || this.globalCache;
  }

  /**
   * Access the global entity cache.
   */
  public get cache(): EntityCache<T> {
    return this.globalCache;
  }

  /**
   * This function is used to map the path ids to a unique key to locate the associated entity
   * within the cache.
   *
   * @param pathIds the pathIds used to determine the key
   * @returns       a unique key to identify the associated entity
   */
  private keyFromPathIds(pathIds: any): string {
    if (pathIds?.key) {
      return pathIds.key;
    } else if (typeof pathIds === 'object') {
      return pathIds['id'].toString();
    } else if (typeof pathIds === 'number') {
      return pathIds.toString();
    } else {
      return pathIds;
    }
  }

  /**
   * Create a key for a request, based on its path and parameters.
   *
   * @param pathIds the ids to embed in the uri
   * @param options the request options, with parameters and end point format
   * @returns a query string with the path and parameters
   */
  private queryKey(pathIds: any, options?: RequestOptions<T>): string {
    const path = this.buildEndpoint(options?.endpointFormat || this.endpointFormat, pathIds);
    const params = options?.params ? new HttpParams({fromObject: options?.params} as HttpParamsOptions) : undefined;
    return path + params?.toString();
  }

  /**
   * Make an update request to the endpoint, using the supplied object to identify which id to update.
   * If updated, the cache is updated ot set with the entity.
   *
   * @param pathIds An object with keys which match the placeholders within the endpointFormat string.
   * @param options Optional request options. This can be used to customise headers, parameters, body, or the associated entity object.
   */
  public update(pathIds: object | T, options?: RequestOptions<T>): Observable<T>;
  public update(pathIds: any, options?: RequestOptions<T>): Observable<T> {
    const cache = this.cacheFor(options);
    return super
      .update(pathIds, options)
      .pipe(tap((updatedEntity) => cache.set(updatedEntity.key, updatedEntity)));
  }

  /**
   * Retrieve entities from the cache, or make a query request (get all) to the end point using the supplied parameters to determine path.
   * Caches all returned entities.
   *
   * @param pathIds An object with keys which match the placeholders within the endpointFormat string.
   * @param options Optional request options. This can be used to customise headers, parameters, body, or the associated entity object.
   * @returns {Observable} an observable through which the response will be returned when complete
   */
   public fetchAll(pathIds?: object, options?: RequestOptions<T>): Observable<T[]> {
    const cache = this.cacheFor(options);
    const queryKey = this.queryKey(pathIds, options);
    if (cache.ranQuery(queryKey) ) {
      return cache.observerFor(queryKey, options);
    } else {
      return this.query(pathIds, options);
    }
  }

  /**
   * Make a query request (get all) to the end point, using the supplied parameters to determine path.
   * Caches all returned entities. This will **not** read Entities from the cache, instead you should
   * use `fetchAll` to query from the cache where possible.
   *
   * @param pathIds An object with keys which match the placeholders within the endpointFormat string.
   * @param options Optional request options. This can be used to customise headers, parameters, body, or the associated entity object.
   * @returns {Observable} an observable through which the response will be returned when complete
   */
  public query(pathIds?: object, options?: RequestOptions<T>): Observable<T[]> {
    const cache = this.cacheFor(options);
    return cache.registerQuery(this.queryKey(pathIds, options), super.query(pathIds, options));
  }

  /**
   * First, tries to retrieve from cache, the object with the id, or id field from the pathIds.
   * If found, return the item from cache, otherwise make a get request to the end point,
   * using the supplied parameters to determine path. Caches the returned object
   *
   * @param pathIds Either the id, if a number and maps simple to ':id', otherwise an object
   *                with keys the match the placeholders within the endpointFormat string.
   * @param options Optional request options. This can be used to customise headers, parameters, body, or the associated entity object.
   */
  public fetch(pathIds: number | string | Entity | object, options?: RequestOptions<T>): Observable<T>;
  public fetch(pathIds: any, options?: RequestOptions<T>): Observable<T> {
    const cache = this.cacheFor(options);
    const queryKey = this.queryKey(pathIds, options);

    // Have we run this query?
    if (cache.ranQuery(queryKey) ) {
      // Return the cached result
      return cache.observerForGet(queryKey, options);
    } else {
      // We haven't run this query, so run it and cache the result
      return super.get(pathIds, options).pipe(
        map((responseEntity: T) => {
          // We have a new response object... but is it already in the cache?
          if (cache.has(responseEntity.key)) {
            // Dont use response entity! We want to return the cached version.
            const cachedEntity = cache.get(responseEntity.key);
            // Update the cached version with the details frm the response.
            Object.assign(cachedEntity, responseEntity);
            return cachedEntity as T;
          } else {
            cache.set(responseEntity.key, responseEntity);
            return responseEntity;
          }
        })
      );
    }
  }

  /**
   * First, tries to retrieve from cache, the object with the id, or id field from the pathIds.
   * If found, return the item from cache, otherwise make a get request to the end point,
   * using the supplied parameters to determine path. Caches the returned object
   *
   * @param pathIds Either the id, if a number and maps simple to ':id', otherwise an object
   *                with keys the match the placeholders within the endpointFormat string.
   * @param options Optional request options. This can be used to customise headers, parameters, body, or the associated entity object.
   */
  public get(pathIds: number | string | object, options?: RequestOptions<T>): Observable<T>;
  public get(pathIds: any, options?: RequestOptions<T>): Observable<T> {
    const key: string = this.keyFromPathIds(pathIds);
    const cache = this.cacheFor(options);
    if (cache.has(key)) {
      return new Observable((observer: any) => observer.next(cache.get(key)));
    } else {
      return super.get(pathIds, options).pipe(tap((entity: T) => cache.set(entity.key, entity)));
    }
  }

  /**
   * Make a create request to the endpoint, using the supplied parameters to determine the path.
   * The results of the request are cached using the key of the entity.
   *
   * @param pathIds An object with keys which match the placeholders within the endpointFormat string.
   * @param options Optional request options. This can be used to customise headers, parameters, body, or the associated entity object.
   * @returns {Observable} a new cold observable with the newly created @type {T}
   */
  public create(pathIds: object, options?: RequestOptions<T>): Observable<T> {
    const cache = this.cacheFor(options);
    return super.create(pathIds, options).pipe(tap((entity) => cache.set(entity.key, entity)));
  }

  /**
   * Make a post request to the endpoint, using the details from the supplied entity to determine the path.
   * The results of the request are cached using the key of the entity.
   *
   * @param entity An object with keys which match the placeholders within the endpointFormat string.
   * @param options Optional request options. This can be used to customise headers, parameters, body, or the associated entity object.
   * @returns {Observable} a new cold observable with the newly created @type {T}
   */
   public store(entity: T, options?: RequestOptions<T>): Observable<T> {
    const cache = this.cacheFor(options);
    return super.store(entity, options).pipe(tap((reponseEntity) => cache.set(reponseEntity.key, reponseEntity)));
  }

  /**
   * Make a delete request to the end point, using the supplied parameters to determine path.
   * If deleted, the object is removed from the cache.
   *
   * @param pathIds Either the id, if a number and maps simple to ':id', otherwise an object
   *                with keys the match the placeholders within the endpointFormat string.
   * @param options Optional http options
   */
  public delete(pathIds: number | object, options?: RequestOptions<T>): Observable<object>;
  public delete(pathIds: any, options?: RequestOptions<T>): Observable<object> {
    const key: string = this.keyFromPathIds(pathIds);
    const cache = this.cacheFor(options);

    return super.delete(pathIds, options).pipe(
      // Tap performs a side effect on Observable, but return it identical to the source.
      tap((response: object) => {
        if (cache.has(key)) {
          cache.delete(key);
        }
      })
    );
  }
}
