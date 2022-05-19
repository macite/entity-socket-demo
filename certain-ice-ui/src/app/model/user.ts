import { IterableChangeRecord } from '@angular/core';
import { Entity } from 'ngx-entity-service';

const KEYS =
  [
    'id',
    'username',
    'name',
    'password'
  ];

export class User extends Entity {
  public id: number = -1;
  public username: string = '';
  public name: string = '';
  public password: string = '';

  /**
   * Convert entity to json - used on put/post
   *
   * @returns json
   */
  public toJson(): any {
    return super.toJsonWithKeys(KEYS);
  }

  /**
   * Update entity from passed in json object
   *
   * @param data json object with data for entity
   */
  public updateFromJson(data: any, params?: any): void {
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
