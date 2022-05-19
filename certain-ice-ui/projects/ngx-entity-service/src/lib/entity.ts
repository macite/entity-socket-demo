/**
 * Entity class is used to represent an object within the main application model. This
 * entity can be transferred to/from the server, and there are functions to assist with
 * copying the object to a data transfer format to send to the server, and functions to
 * assist with updating the object based upon responses from the server.
 *
 * When implementing an Entity you need to:
 * 1: Override @method toJson to convert the entity to json. This can use
 *    @method toJsonWithKeys to indicate the values to copy.
 * 2: Override @method updateFromJson to update the entity with data from a json object.
 *    This is the inverse of @method toJson and can be @method setFromJson.
 * 3: Override @method key to indicate a unique value used to cache the entity
 *    (if/when cached)
 * 4: Implement a EntityService to handle transmission of this object to the server
 *    for CRUD operations.
 */
export abstract class Entity {

  /**
   * Use to set the key case for mapping **from** json **to** the entity.
   * This will be the case used for keys in the entity object.
   *
   * Defaults to snake.
   */
  protected jsonCase: 'camel' | 'snake' = 'snake';

  /**
   * Use to set the key case for mapping **from** json **to** the entity.
   * This will be the case used for keys in the entity object.
   *
   * Defaults to camel.
   */
  protected entityCase: 'camel' | 'snake' = 'camel';

  /**
   * Map the key to the indicated case
   *
   * @param key the key string to map
   * @param toCase the case to map to
   * @returns the new key
   */
  private keyToCase(key: string, toCase: 'camel' | 'snake'): string {
    if (toCase === 'camel') {
      return key.charAt(0).toLowerCase() + key.slice(1);
    } else {
      return key.replace(/([A-Z])/g, '_$1').toLowerCase();
    }
  }

  /**
   * Construct an Entity object
   *
   * @param initialData An optional object storing the data to initialise the Entity with, calls @method updateFromJson with the data.
   */
  constructor(initialData?: object, params?: any) {
    if (initialData) {
      this.updateFromJson(initialData, params);
    }
  }

  /**
   * Convert the entity object to json.
   *
   * @returns A json representation of the entity.
   */
  public abstract toJson(): any;

  /**
   * Update the current entity from information within the passed in json object.
   *
   * @param data    The json object containing the data to copy into the entity.
   * @param params  Additional paramters needed for reference during updating
   */
  public abstract updateFromJson(data: any, params?: any): void;

  /**
   * Update the entity with data from the passed in json object. This is used when updated
   * details are fetched from the server. This method takes care of copying data by key
   * from the json data to the entity itself.
   *
   * @param data  the new data to be stored within the entity
   * @param keys  the keys of the data to map
   * @param maps  an optional map of functions that are called to translate
   *              specific values from the json where a straight data copy is not
   *              appropriate/possible.
   */
  protected setFromJson(data: any, keys: string[], ignoredKeys?: string[], maps?: object): void {
    if (!data) return;

    keys.forEach((key) => {
      const jsonKey = this.keyToCase(key, this.jsonCase);
      const entityKey = this.keyToCase(key, this.entityCase);

      if (jsonKey in data === false) return;

      if (maps && maps[key]) {
        this[entityKey] = maps[key](data[jsonKey]);
      } else if ((ignoredKeys && ignoredKeys.indexOf(key) < 0) || !ignoredKeys) {
        this[entityKey] = data[jsonKey];
      }
    });
  }

  /**
   * Gets the unique key which represents the Entity
   * For example, an id: number, or for Task Entity, project ID and task Definition ID.
   *
   * @returns string containing the unique key value
   */
  public abstract get key(): string;

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
  protected toJsonWithKeys(keys: string[], maps?: object): object {
    const json: object = {};
    keys.forEach((key) => {
      const jsonKey = this.keyToCase(key, this.jsonCase);
      const entityKey = this.keyToCase(key, this.entityCase);

      if (maps && maps[key]) {
        json[jsonKey] = maps[key](this, key);
      } else {
        json[jsonKey] = this[entityKey];
      }
    });
    return json;
  }
}
