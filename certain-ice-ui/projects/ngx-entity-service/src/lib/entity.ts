import { EntityMapping } from "./entity-mapping";

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
   * Retains a copy of the json used to build the entity. This is used when
   * mapping to json to determine which properties have been updated.
   */
  public originalJson: any = undefined;

  /**
   * Convert the entity object to json.
   *
   * @returns A json representation of the entity.
   */
  public toJson<T extends Entity>(mappingData: EntityMapping<T>, ignoreKeys?: string[]): object {
    return mappingData.mapEntityToJson((this as unknown) as T, ignoreKeys);
  }

  /**
   * Update the current entity from information within the passed in json object.
   *
   * @param data    The json object containing the data to copy into the entity.
   * @param params  Additional paramters needed for reference during updating
   */
  public updateFromJson<T extends Entity>(data: any, mappingData: EntityMapping<T>, onCompleteCallback?: (entity: T) => void): void {
    if ( this.originalJson ) {
      Object.assign(this.originalJson, data);
    } else {
      this.originalJson = data;
    }

    mappingData.updateEntityFromJson((this as unknown) as T, data, onCompleteCallback);
  }

  /**
   * Gets the unique key which represents the Entity. By default this returns
   * the value of the id property.
   *
   * @returns string containing the unique key value
   */
  public get key(): string | number {
    return this['id'];
  }
}
