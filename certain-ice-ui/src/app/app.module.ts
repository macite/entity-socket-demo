import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { UserService } from './model/user.service';
import { MessageService } from './model/message.service';
import { ActionCableService } from './model/actioncable.service';

import { UserListComponent } from './components/user-list/user-list.component';
import { MessageListComponent } from './components/message-list/message-list.component';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    MessageListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    UserService,
    MessageService,
    ActionCableService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
