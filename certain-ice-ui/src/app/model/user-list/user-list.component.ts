import { HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { User } from "../user";
import { UserService } from "../user.service";

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
    this.userService.query().subscribe(
      (users: User[]) => {
        this.users.push(...users);
      }
    );
  }

  public addUser(username: string, name: string, password: string) {
    const data = {
      id: 1,
      username: username,
      name: name,
      password: password
    }

    // let u: User = this.users[0];
    // this.userService.put<User>(u).subscribe( (user: User) => {console.log(user)} );
    this.userService.create(undefined, data ).subscribe(
      (user: User) => {
        this.users.push(user);
      }
    );
  }

  public deleteUser(user: User) {
    this.userService.delete(user).subscribe( (response) => { this.users = this.users.filter( (u: User) => u.id != user.id ) } );
  }

}
