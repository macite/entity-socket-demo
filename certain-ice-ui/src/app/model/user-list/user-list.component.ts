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
    )
  }

}
