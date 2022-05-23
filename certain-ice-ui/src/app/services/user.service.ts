import { User } from '../model/user';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import API_URL from './apiURL';
import { CachedEntityService } from 'projects/ngx-entity-service/src/public-api';

@Injectable()
export class UserService extends CachedEntityService<User> {
  protected readonly endpointFormat = 'users/:id:';

  constructor(
    httpClient: HttpClient,
  ) {
    super(httpClient, API_URL);
    this.cache.cacheExpiryMilliseconds = 60 * 1000;

    this.mapping.jsonCase = 'snake';

    this.mapping.addKeys(
      'id',
      'username',
      'name',
      'password'
    );

    this.mapping.mapAllKeysToJsonExcept('id');
  }

  public override createInstanceFrom(json: any, other?: any): User {
    const user = new User();
    return user;
  }

  public override keyForJson(json: any): string {
    return json.username;
  }
}
