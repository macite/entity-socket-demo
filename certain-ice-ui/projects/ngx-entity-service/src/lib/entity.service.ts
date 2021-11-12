import { Entity } from './entity';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { RequestOptions } from './request-options';

/**
 * ResourceService, responsible for the CRUD actions for all resources which inherit form it.
 * This is used to interact with the server, and create Entity objects that are returned for
 * use within the application.
 */
export abstract class EntityService<T extends Entity> {
  /**
   * Provide a string template for the endpoint URLs in the format
   * 'path/to/:id1:/other/:id2:' where ':id1:' and ':id2:' are placeholders for id values
   * passed into the CRUD methods.
   *
   * Use :id for simple cases eg: 'users/:id:'. This can then be shortcut to provide just the
   * value without needing to indicate the key to replace. eg UserService.get(1) instead of
   * UserService.get({id: 1}])
   *
   * @returns {string} The endpoint string format
   */
  protected abstract readonly endpointFormat: string;

  /**
   * The base url of the api associated with this entity service.
   */
  protected apiUrl: string;

  /**
   * Construct the EntityService with the passed in HttpClient and apiUrl. This should be the
   * base class for a Angular service.
   *
   * @param httpClient the reference to the http client used to make http requests.
   * @param apiUrl the base url
   */
  constructor(private httpClient: HttpClient, apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  /**
   * Helper function to convert end point format strings to final path
   *
   * @param path the end point format string with id placeholders
   * @param object the object to get id values from for the placeholder.
   * @returns {string} The endpoint.
   */
  protected buildEndpoint(path: string, object?: object): string {
    // Replace any keys with provided values
    if (object) {
      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          // If the key is undefined, just replace with an empty string.
          path = path.replace(`:${key}:`, object[key] ? object[key] : '');
        }
      }
    }

    // Strip any missed keys
    path = path.replace(/:[\w-]*?:/, '');
    return `${this.apiUrl}/${path}`;
  }

  /**
   * Get the body for this request.
   *
   * @param pathIds the pathIds for the request
   * @param options the request options
   * @returns the body to use for the http request
   */
  private bodyFor(pathIds: object | T | any, options?: RequestOptions<T>): FormData | object | undefined {
    return options?.body || options?.entity?.toJson() ||  typeof pathIds.toJson === 'function' ? pathIds.toJson() : pathIds;
  }

  /**
   * Convert accepted data to @class Entity object
   *
   * @param json The json data to convert to T
   */
  protected abstract createInstanceFrom(json: any, other?: any): T;

  /**
   * Make a get request to the end point, using the supplied parameters to determine path.
   *
   * @param pathIds Either the id, if a number and maps simple to ':id', otherwise an object
   *                with keys the match the placeholders within the endpointFormat string.
   * @param options Optional request options. This can be used to customise headers, parameters, body, or the associated entity object.
   */
  public get(pathIds: number | object, options?: RequestOptions<T>): Observable<T>;
  public get(pathIds: any, options?: RequestOptions<T>): Observable<T> {
    const object = { ...pathIds };
    if (typeof pathIds === 'number') {
      object['id'] = pathIds;
    }
    const path = this.buildEndpoint(options?.endpointFormat || this.endpointFormat, object);

    return this.httpClient.get(path, options).pipe(map((rawData) => this.createInstanceFrom(rawData, options?.constructorParams))); // Turn the raw JSON returned into the object T
  }

  /**
   * Make a query request (get all) to the end point, using the supplied parameters to determine path.
   *
   * @param pathIds An object with keys which match the placeholders within the endpointFormat string.
   * @param options Optional request options. This can be used to customise headers, parameters, body, or the associated entity object.
   * @returns {Observable} which will be used to pass the resulting entity objects when the response is processed.
   */
  public query(pathIds?: object, options?: RequestOptions<T>): Observable<T[]> {
    const path = this.buildEndpoint(options?.endpointFormat || this.endpointFormat, pathIds);
    return this.httpClient
      .get(path, options)
      .pipe(map((rawData) => this.convertCollection(rawData instanceof Array ? rawData : [rawData], options?.constructorParams)));
  }

  /**
   * Make an update request to the endpoint, using the supplied object to identify which id to update.
   *
   * @param pathIds An object with keys which match the placeholders within the endpointFormat string.
   * @param options Optional request options. This can be used to customise headers, parameters, body, or the associated entity object.
   */
  public update(pathIds: object | T, options?: RequestOptions<T>): Observable<T>;
  public update(pathIds: any, options?: RequestOptions<T>): Observable<T> {
    // ensure that body is defined in options
    if (options === undefined) {
      options = {};
    }

    options.body = this.bodyFor(pathIds, options);

    // locate the entity in the request
    const entity: T = options.entity || pathIds as T;

    // need to pass object through as path id and form data
    return this.put<T>(pathIds, options).pipe(
      map((rawData) => {
        entity.updateFromJson(rawData);
        return entity;
      })
    );
  }

  /**
   * Make an put request to the endpoint, indicating the type of data to be returned from the endpoint.
   * pathIds is used together with the endpointFormat to determine the path for the request. The body comes
   * from `options.body`, from calling `pathIds.toJson()`, or directly passing pathIds (in that order).
   *
   * @typeparam S The type of the data to be returned
   * @param pathIds An object with keys which match the placeholders within the endpointFormat string.
   * @param options Optional request options. This can be used to customise headers, parameters, body, or the associated entity object.
   */
  public put<S>(pathIds: object, options?: RequestOptions<T>): Observable<S>;
  public put<S>(pathIds: any, options?: RequestOptions<T>): Observable<S> {
    const object = { ...pathIds };
    const json = this.bodyFor(pathIds, options);
    const path = this.buildEndpoint(options?.endpointFormat || this.endpointFormat, object);

    return this.httpClient.put(path, json, options) as Observable<S>;
  }

  /**
   * Make a create request to the endpoint, using the supplied parameters to determine the path.
   *
   * @param pathIds An object with keys which match the placeholders within the endpointFormat string.
   * @param options Optional request options. This can be used to customise headers, parameters, body, or the associated entity object.
   * @returns {Observable} a new cold observable with the newly created @type {T}
   */
  public create(pathIds?: object, options?: RequestOptions<T>): Observable<T>;
  public create(pathIds?: any, options?: RequestOptions<T>): Observable<T> {
    const object = { ...pathIds };
    const json = this.bodyFor(pathIds, options);
    const path = this.buildEndpoint(options?.endpointFormat || this.endpointFormat, object);
    return this.httpClient.post(path, json, options).pipe(map((rawData) => this.createInstanceFrom(rawData, options?.constructorParams)));
  }

  /**
   * Make a delete request to the end point, using the supplied parameters to determine path.
   *
   * @param pathIds Either the id, if a number and maps simple to ':id', otherwise an object
   *                with keys the match the placeholders within the endpointFormat string.
   * @param options Optional http options
   */
  public delete(pathIds: number | object, options?: RequestOptions<T>): Observable<object>;
  public delete(pathIds: any, options?: RequestOptions<T>): Observable<object> {
    const object = { ...pathIds };
    if (typeof pathIds === 'number') {
      object['id'] = pathIds;
    }
    const path = this.buildEndpoint(options?.endpointFormat || this.endpointFormat, object);

    return this.httpClient.delete(path, options);
  }

  /**
   * Instantiates an array of elements as objects from the JSON returned
   * from the server.
   * @returns {T[]} The array of Objects
   */
  private convertCollection(collection: any, other?: any): T[] {
    return collection.map((data: any) => this.createInstanceFrom(data, other));
  }

  /**
   * Gets the unique key for an entity of type @class Entity.
   * This is used to identify the object within a cache.
   *
   * @param json The json object to get the key from
   * @returns string containing the unique key value
   */
  public abstract keyForJson(json: any): string;
}
