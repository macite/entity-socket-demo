import { Entity } from 'ngx-entity-service';

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

  /**
   * Convert entity to json - used on put/post
   *
   * @returns json
   */
  public toJson(): any {
    var result: object;

    result = super.toJsonWithKeys(KEYS);
    result['message_kind'] = this.kind?.id;

    return result;
  }

  /**
   * Update entity from passed in json object
   *
   * @param data json object with data for entity
   */
  public updateFromJson(data: any, params?: any): void {
    this.setFromJson(data, KEYS);
    //this.username = data['username']; //etc

    const kindStore: Map<string, MessageKind> = params as Map<string, MessageKind>;

    this.kind = kindStore.get(data['message_kind']);
  }

  public get key(): string {
    return this.id?.toString() || '';
  }

  public keyForJson(json: any): string {
    return json.id;
  }
}
