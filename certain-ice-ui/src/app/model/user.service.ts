import { User } from './user';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EntityService } from '@doubtfire-lms/entity-service';

@Injectable()
export class UserService extends EntityService<User> {
  entityName: string = 'User';
  protected readonly endpointFormat = 'users/:id:';

  constructor(
    httpClient: HttpClient,
  ) {
    super(httpClient);
  }

  protected createInstanceFrom(json: any, other?: any): User {
    const user = new User();
    user.updateFromJson(json);
    return user;
  }

  public keyForJson(json: any): string {
    return json.id;
  }
}
