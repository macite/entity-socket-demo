import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EntityService } from 'ngx-entity-service';
import { Conversation } from './conversation';
import API_URL from './apiURL';

@Injectable()
export class ConversationService extends EntityService<Conversation> {
  entityName: string = 'Conversation';
  protected readonly endpointFormat = 'rooms/:id:';

  constructor(
    httpClient: HttpClient,
  ) {
    super(httpClient, API_URL);
  }

  protected createInstanceFrom(json: any, other?: any): Conversation {
    if (other){
      return json;
    }else{
      const conversation = new Conversation();
      conversation.updateFromJson(json);
      return conversation;
    }
  }

  public keyForJson(json: any): string {
    return json.id;
  }
}
