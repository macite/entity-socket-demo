import { Entity } from "./entity";
import { EntityMapping, ToEntityMapOperation, ToEntityMapOperationAsync } from "./entity-mapping";

/**
 * The mapping process is used to track the progress of map data from json to an entity. This is needed
 * when there is an asynchronous step within the mapping process. In this case the original mapping call
 * can proceed, while the asynchronous call is made to fetch the related data. Once the asynchronous call
 * completes, it needs to call `continue` to on the `MappingProcess` object to continue the mapping process.
 */
export class MappingProcess<T extends Entity> {

  public plan: EntityMapping<T>;
  public entity: T;
  public data: object;
  private index: number;

  /**
   * Construct a mapping process for the provided mapping data, entity, and json.
   * @param plan the mapping plan
   * @param entity the entity to populate
   * @param data the json data to map
   */
  constructor(plan: EntityMapping<T>, entity: T, data: object) {
    this.plan = plan;
    this.entity = entity;
    this.data = data;
    this.index = 0;
  }

  /**
   * Return the current entity key.
   */
  public get currentKey(): string {
    if ( this.index > 0) {
      return this.plan.keys[this.index - 1].entityKey;
    } else {
      return this.plan.keys[0].entityKey;
    }
  }

  /**
   * Start the process of mapping the entity. This will return when the mapping is
   * complete, or at the first asynchronous call. When the asynchronous call is ready to
   * continue the mapping, it needs to call `continue()` to continue the mapping process.
   */
  public execute(): void {
    // Loop across the mapping plan keys
    while(this.index < this.plan.keys.length) {
      const keyPair = this.plan.keys[this.index];

      const jsonKey = keyPair.jsonKey;
      const entityKey = keyPair.entityKey;

      // Map this key if it is in json
      if (jsonKey in this.data) {
        // Run map operations as priority
        if (this.plan.mapOperations.toEntity[entityKey]) {
          const op = this.plan.mapOperations.toEntity[entityKey];
          if (op.kind === "async") {
            op.fn(this);
            return; // end the loop as we cannot continue now...
          } else {
            op.fn(this.data, entityKey, this.entity, this.plan.constructorParams);
          }
        } else if (this.plan.mapFunctions.toEntity[entityKey]) {
          // Run mapping function....
          this.entity[entityKey] = this.plan.mapFunctions.toEntity[entityKey](this.data, entityKey, this.entity, this.plan.constructorParams);
        } else {
          // or just copy in the data
          this.entity[entityKey] = this.data[jsonKey];
        }
      }

      // Move to next index
      this.index++;
    }
  }

  /**
   * Continue the mapping process. This is used at the end of an asynchronous mapping operation to continue the mapping with the
   * remaining keys.
   */
  public continue() {
    this.index++;
    this.execute();
  }

}
