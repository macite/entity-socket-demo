import { HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Message } from "src/app/model/message";
import { MessageService } from "src/app/model/message.service";

@Component({
  selector: 'message-list',
  templateUrl: 'message-list.component.html',
  styleUrls: ['message-list.component.css'],
})
export class MessageListComponent implements OnInit {
  messages: Message[] = new Array<Message>();

  constructor(
    private messageService: MessageService
  ) {
  }

  ngOnInit() {
    this.messageService.query().subscribe(
      (messages: Message[]) => {
        this.messages.push(...messages);
      }
    );
  }

  public addMessage(content: string) {
    const data = {
      content: content,
    }

    // let u: message = this.messages[0];
    // this.messageService.put<message>(u).subscribe( (message: message) => {console.log(message)} );
    this.messageService.create(data).subscribe(
      (message: Message) => {
        this.messages.push(message);
      }
    );
  }

  public deleteMessage(message: Message) {
    this.messageService.delete(message).subscribe( (response : any) => { this.messages = this.messages.filter( (u: Message) => u.id != message.id ) } );
  }

}
