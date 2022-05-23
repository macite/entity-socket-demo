import { Entity } from "projects/ngx-entity-service/src/public-api";


const KEYS =
  [
    'id',
    'content',
    'messageColor'
  ];

export class MessageKind {
  public id: string = "test";

  constructor(kind: string) {
    this.id = kind;
  }
}

export class Message extends Entity {
  public id?: number = undefined;
  public content: string = '';
  public kind?: MessageKind = undefined;
  public messageColor: number = 0;

}
