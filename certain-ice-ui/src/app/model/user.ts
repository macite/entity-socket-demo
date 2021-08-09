import { IterableChangeRecord } from '@angular/core';
import { Entity } from './entity';

const KEYS =
  [
    'id',
    'username',
    'name',
    'password'
  ];

export class User extends Entity {
  id: number = -1;
  username: string = '';
  name: string = '';
  password: string = '';

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
    return this.username.toString();
  }

  public keyForJson(json: any): string {
    return json.username;
  }
}
