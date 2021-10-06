import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/model/message';
import { MessageService } from 'src/app/model/message.service';
import * as ActionCable from 'actioncable';
import { CachedEntityService } from 'src/app/model/cached-entity.service'; 

@Component({
  selector: 'message-list',
  templateUrl: 'message-list.component.html',
  styleUrls: ['message-list.component.css'],
})
export class MessageListComponent implements OnInit {
  messages: Message[] = new Array<Message>();
  private consumer: any;
  public cachedEntity: set

  constructor(public messageService: MessageService) {}

  ngOnInit() {
    this.messageService.query().subscribe((messages: Message[]) => {
      this.messages.push(...messages);
    });
  }

  public addMessage(content: string) {
    const data = {
      content: content,
    };
    // let u: message = this.messages[0];
    // this.messageService.put<message>(u).subscribe( (message: message) => {console.log(message)} );
    this.messageService
      .create(undefined, data)
      .subscribe((message: Message) => {
        this.messages.push(message);
      });
  }

  public subscribeMe(data: string) {
    let newMsg = { content: data };
    this.consumer = ActionCable.createConsumer(`ws://localhost:3000/cable`);
    console.log('Trying connection');
    const channel = this.consumer.subscriptions.create('ActionchatChannel', {
      connected() {
        console.log('Subscription is ready for use');
        console.log(channel);
        channel.send({ message: data });
      },
      disconnected() {
        console.log('Service terminated by WB server');
      },
      received(message: any) {
        console.log('This is the data received: ', message);
      },
    });
    this.messageService
      .create(undefined, newMsg)
      .subscribe((message: Message) => {
        this.messages.push(message);
      });
  }

  public deleteMessage(message: Message) {
    this.messageService.delete(message).subscribe((response: any) => {
      this.messages = this.messages.filter((u: Message) => u.id != message.id);
    });
  }
}
