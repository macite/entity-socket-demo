import { Entity } from 'ngx-entity-service';

const KEYS =
  [
    'id',
    'content'
  ];

export class Message extends Entity {
  id: number = -1;
  content: string = '';

  /**
   * Convert entity to json - used on put/post
   *
   * @returns json
   */
  toJson(): any {
    return super.toJsonWithKeys(KEYS);
  }

  /**
   * Update entity from passed in json object
   *
   * @param data json object with data for entity
   */
  public updateFromJson(data: any): void {
    this.setFromJson(data, KEYS);
    //this.username = data['username']; //etc
  }

  public get key(): string {
    return this.id.toString();
  }

  public keyForJson(json: any): string {
    return json.id;
  }
}
