import { Entity, EntityMapping } from "projects/ngx-entity-service/src/public-api";

export class User extends Entity {
  public id: number = -1;
  public username: string = '';
  public name: string = '';
  public password: string = '';

  public get key(): string {
    return this.username.toString();
  }
}
