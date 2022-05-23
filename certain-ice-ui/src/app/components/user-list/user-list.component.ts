import { Component, OnInit } from "@angular/core";
import { RequestOptions } from "projects/ngx-entity-service/src/public-api";
import { User } from "src/app/model/user";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: 'user-list',
  templateUrl: 'user-list.component.html',
  styleUrls: ['user-list.component.css'],
})
export class UserListComponent implements OnInit {
  users: User[] = new Array<User>();

  constructor(
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.refreshData();
  }

  public refreshData(value?: string, all: boolean = false) {
    let options : RequestOptions<User> = {};
    if (value) {
      options.params = {
         'filter' : value
        };
     }

    if (all) {
      options.onCacheHitReturn = 'all';
    }

    this.userService.fetchAll(undefined, options).subscribe(
      (users: User[]) => {
        this.users.length = 0;
        this.users.push(...users);
      }
    );
  }

  public addUser(username: string, name: string, password: string) {
    const data = {
      username: username,
      name: name,
      password: password
    }

    // let u: User = this.users[0];
    // this.userService.put<User>(u).subscribe( (user: User) => {console.log(user)} );
    this.userService.create(data).subscribe(
      (user: User) => {
        this.users.push(user);
      }
    );
  }

  public deleteUser(user: User) {
    this.userService.delete(user).subscribe( (response : any) => { this.users = this.users.filter( (u: User) => u.id != user.id ) } );
  }

}
