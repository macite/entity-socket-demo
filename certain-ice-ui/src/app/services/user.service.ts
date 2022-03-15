import { User } from '../model/user';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CachedEntityService } from 'ngx-entity-service';
import API_URL from './apiURL';

@Injectable()
export class UserService extends CachedEntityService<User> {
  protected readonly endpointFormat = 'users/:id:';

  constructor(
    httpClient: HttpClient,
  ) {
    super(httpClient, API_URL);
    this.cache.cacheExpiryMilliseconds = 60 * 1000;
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
