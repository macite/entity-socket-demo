import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EntityService } from 'ngx-entity-service';
import { Message } from '../model/message';
import API_URL from './apiURL';

@Injectable()
export class MessageService extends EntityService<Message> {
  entityName: string = 'Message';
  protected readonly endpointFormat = 'messages/:id:';

  constructor(
    httpClient: HttpClient,
  ) {
    super(httpClient, API_URL);
  }

  protected createInstanceFrom(json: any, other?: any): Message {
    const message = new Message();
    message.updateFromJson(json, other);
    return message;
  }

  public keyForJson(json: any): string {
    return json.id;
  }
}
