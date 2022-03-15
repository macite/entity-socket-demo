import { HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Message } from "src/app/model/message";
import { MessageService } from "src/app/services/message.service";
import * as ActionCable from 'actioncable';

@Component({
  selector: 'message-list',
  templateUrl: 'message-list.component.html',
  styleUrls: ['message-list.component.css'],
})
export class MessageListComponent implements OnInit {
  messages: Message[] = new Array<Message>();
  private consumer: any;
  private channel: any;

  constructor(
    private messageService: MessageService
  ) {
  }

  ngOnInit() {
    this.consumer = ActionCable.createConsumer(`ws://localhost:3000/cable`);
    this.channel = this.consumer.subscriptions.create('ChatChannel', {
      connected() {
        console.log("connected");
      },
      disconnected() {
        console.log("disconnected");
      },
      received: (msgContent: any) => ( console.log(msgContent))
    });

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
