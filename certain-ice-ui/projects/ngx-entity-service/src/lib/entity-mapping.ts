import { Entity } from "./entity";
import { MappingProcess } from "./mapping-process";

export type ToJsonMapFunction<T extends Entity> = (entity: T, key: string) => any;
export type ToEntityMapFunction<T extends Entity> = (data: object, jsonKey: string, entity: T, params?: any) => any;
export type ToEntityMapOperation<T extends Entity> = (data: object, jsonKey: string, entity: T, params?: any) => void;
export type ToEntityMapOperationAsync<T extends Entity> = (process: MappingProcess<T>) => void;

/**
 * Entity mapping is use to transfer data between entity and json. In the framework, json acts
 * as a data transfer object (DTO) and entity acts as a domain object. The mapping is used to
 * copy data from json into new or existing Entity objects, and to copy data from Entity objects
 * to json when sending to the server.
 */
export class EntityMapping<T extends Entity> {

  /**
   * Use to set the key case for mapping **from** json **to** the entity.
   * This will be the case used for keys in the entity object.
   *
   * Defaults to snake.
   */
  public jsonCase: 'camel' | 'snake' = 'snake';

  /**
   * Indicates the keys from the entity are directly mapped using updateFromJson.
   */
  public keys: { entityKey: string, jsonKey: string}[] = [];

  /**
   * Indicate the keys that are to be mapped to json for this entity.
   * This is used when sending data to the server.
   */
  public jsonKeys: string[] = [];

  /**
   * By default the mapping process will use the `originalJson` from the Entity
   * to determine if values have changed when mapping an Entity to json. Set this
   * to false if you want all mapped values to be copied into the json.
   */
  public onlyMapChanges: boolean = true;

  /**
   * Mapping functions maps one value betweeen the entity and json. Functions return these
   * values, and store them in the associated property in the entity or json.
   *
   * See mapOperations as an alternative.
   */
  public mapFunctions: {
    toJson: { [key: string]: ToJsonMapFunction<T> },
    toEntity: { [key: string]: ToEntityMapFunction<T> }
  } = { toJson: {}, toEntity: {} };

  /**
   * A map operation is used to trigger an action on the entity during the mapping process. This receives
   * the indicated data, indicated key, and the entity to update. The mapping operation needs to perform
   * the action on the entity, as compared with mapFunctions which return the value to assign.
   *
   * The mapOperations are useful for mapping collections, where values need to be added to the entity.
   */
  public mapOperations: {
    toEntity: { [key: string]: { kind: "sync", fn: ToEntityMapOperation<T> } | { kind: "async", fn: ToEntityMapOperationAsync<T> } }
  } = { toEntity: {} };

  /**
   * Any additional parameters needed to be passed to the entity during mapping.
   */
  public constructorParams?: any;

  /**
   * Call this upon completion of the mapping process. This is useful when the mapping involved asynchronous operations
   * and the caller needed to know when the mapping is complete.
   */
  public mappingCompleteCallback?: (entity: T) => void;

  /**
   * Map the key to the indicated case
   *
   * @param key the key string to map
   * @param toCase the case to map to
   * @returns the new key
   */
  public keyToCase(key: string, toCase: 'camel' | 'snake'): string {
    if (toCase === 'camel') {
      return key.charAt(0).toLowerCase() + key.slice(1);
    } else {
      return key.replace(/([A-Z])/g, '_$1').toLowerCase();
    }
  }

  /**
   * Add a mapping for a given key, with optional mapping functions.
   *
   * @param key the key to map between the entity and json
   * @param toEntityFn optional function for mapping json to the entity
   * @param toJsonFn optional function for mapping the entity to json
   */
  public addKey(key: string | string[], toEntityFn?: ToEntityMapFunction<T>, toJsonFn?: ToJsonMapFunction<T>): void {

    const data = {
      entityKey:  Array.isArray(key) ? key[0] : key,
      jsonKey:    Array.isArray(key) ? key[1] : this.keyToCase(key, this.jsonCase)
    };

    this.keys.push(data);

    if (toEntityFn) {
      this.mapFunctions.toEntity[data.entityKey] = toEntityFn;
    }
    if (toJsonFn) {
      this.mapFunctions.toJson[data.jsonKey] = toJsonFn;
    }
  }

  /**
   * Setup the mappings for the entity. This is used when creating a new entity, or converting to json.
   *
   * @param mapData the mapping data, with each being the string key, an array with two elements mapping
   *                the entity key to json key, or a hash with the keys (as string or array) and options
   *                for the mapping functions and operations.
   */
  public addKeys( ...mapData: (string | string[] | {keys: (string | string[]), toEntityFn?: ToEntityMapFunction<T>, toJsonFn?: ToJsonMapFunction<T>, toEntityOp?: ToEntityMapOperation<T>, toEntityOpAsync?: ToEntityMapOperationAsync<T>})[] ): void {
    mapData.forEach(data => {
      if (typeof data === 'string') {
        this.addKey(data as string);
      } else if (Array.isArray(data)) {
        this.addKey(data as string[]);
      } else {
        this.addKey(data.keys, data.toEntityFn, data.toJsonFn);

        //TODO: validate only one of these is provided.
        if (data.toEntityOp) {
          this.addEntityOperation(data.keys, data.toEntityOp);
        } else if (data.toEntityOpAsync) {
          this.addAsyncEntityOperation(data.keys, data.toEntityOpAsync);
        }
      }
    });
  }

  /**
   * Indicate the entity keys to map to json, other keys are ignored.
   *
   * @param keys the entity key to include when mapping to json
   */
  public addJsonKey(... keys: string[]): void {
    keys.forEach(key => {
      if ( this.jsonKeys.indexOf(key) === -1 ) {
        this.jsonKeys.push(key);
      }
    });
  }

  /**
   * Map all of the entity keys to json. None are mapped by default.
   */
  public mapAllKeysToJson(): void {
    this.addJsonKey(
      ...this.keys.map(key => { return key.entityKey; })
    );
  }

  /**
   * Map all of the entity keys to json, except those listed. None are mapped by default.
   */
   public mapAllKeysToJsonExcept(...ignoreKeys: string[]): void {
    this.addJsonKey(
      ...this.keys.map(key => { return key.entityKey; }).filter(key => { return (!ignoreKeys) || ignoreKeys.indexOf(key) === -1 })
    );
  }

  /**
   * Add an operation to be performed on an entity during mapping. These synchronous actions do not need
   * to make async calls and wait for responses to update the entity. If you need to make an asynchronous call
   * that must complete before the rest of the entity mapping occures, then use the `addAsyncEntityOperation` method.
   *
   * @param key the key to  identify within the data
   * @param operation the action to perform on the entity
   */
  public addEntityOperation(key: string | string[], operation: ToEntityMapOperation<T>): void {
    const entityKey = Array.isArray(key) ? key[0] : key;
    this.mapOperations.toEntity[entityKey] = {kind: "sync", fn: operation};
  }

  /**
   * Add an operation to be performed on an entity during mapping. This is used in cases where an asynchronous call
   * is needed (such as to fetch related entities from the server). In these cases you need to use the `MappingProcess`
   * class to `continue` execution of the mapping once the asynchronous call has completed.
   *
   * @param key the key to  identify within the data
   * @param operation the action to perform on the entity
   */
   public addAsyncEntityOperation(key: string | string[], operation: ToEntityMapOperationAsync<T>): void {
    const entityKey = Array.isArray(key) ? key[0] : key;
    this.mapOperations.toEntity[entityKey] = {kind: "async", fn: operation};
  }

  /**
   * Update the entity with data from the passed in json object. This is used when updated
   * details are fetched from the server. This method takes care of copying data by key
   * from the json data to the entity itself.
   *
   * @param entity the entity to update
   * @param data  the new data to be stored within the entity
   */
  public updateEntityFromJson(entity: T, data: any, onCompleteCallback?: (entity: T) => void): void {
    if (!data || !entity) return;

    const plan = new MappingProcess<T>(this, entity, data, onCompleteCallback);
    plan.execute();
  }

  /**
   * Copy the data within the entity into a json object and return. This is used when
   * data needs to be copied from the entity and sent to the server. Data is copied from
   * the entity for each of the @param keys which are directly copied from the entity
   * into the json. Where data cannot be directly copied, the @param maps map can be
   * use to provide key based mapping functions to translate the data.
   *
   * @param keys  an optional map of functions that are called to translate
   *              specific values from the entity where a straight data copy is not
   *              appropriate/possible.
   */
  public mapEntityToJson(entity: T, ignoreKeys?: string[]): object {
    const json: object = {};

    this.keys.forEach((hash) => {
      // Get the json and entity key
      const jsonKey = hash.jsonKey;
      const entityKey = hash.entityKey;

      const originalJsonProperty = entity.originalJson ? entity.originalJson[jsonKey] : undefined;

      // Skip keys we ignore, and those we do not export
      if( (ignoreKeys && ignoreKeys.indexOf(entityKey) !== -1) || this.jsonKeys.indexOf(entityKey) === -1 ) {
        return;
      }

      var newValue: any;
      // Use keys and mapping functions to get the value into json
      if (this.mapFunctions.toJson && this.mapFunctions.toJson[jsonKey]) {
        newValue = this.mapFunctions.toJson[jsonKey](entity, entityKey);
      } else {
        newValue = entity[entityKey];
      }

      if (!this.onlyMapChanges || (originalJsonProperty === undefined || originalJsonProperty !== newValue)) {
        json[jsonKey] = newValue;
      }
    });
    return json;
  }
}
