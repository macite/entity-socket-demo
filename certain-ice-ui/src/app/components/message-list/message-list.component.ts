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
  // private cable: ActionCable.Cable;
  // private subscription: ActionCable.Channel.ActionchatChannel;
  public channel: any;
  public msgCount = 0;
  constructor(public messageService: MessageService) {}

  ngOnInit() {
    this.consumer = ActionCable.createConsumer(`ws://localhost:3000/cable`);
    this.channel = this.consumer.subscriptions.create('ActionchatChannel', {
      connected() {
        console.log('Channel subscribed on page load!', this.channel);
      },
      disconnected() {
        // console.log('Service terminated by WB server');
      },
      received: () => this.retrieveMessages(),
    });
    // This is no longer being used because the above gets called everytime the page is updated - thereby calling retrieve
    // this.retrieveMessages();
  }

  ngAfterViewInit() {
    this.messageService.query().subscribe((messages: Message[]) => {
      this.msgCount = messages.length;
      console.log("### Run first time only! #### Message length: ", messages.length, " MessageCount: ", this.msgCount);
      this.messageService.query().subscribe((messages: Message[]) => {
        this.messages.push(...messages);
      });
    });
  }

  public addMessage(content: string) {
    const data = {
      content: content,
    };
    this.messageService
      .create(undefined, data)
      .subscribe((message: Message) => {
        this.messages.push(message);
      });
  }

  public retrieveMessages(): void {
    this.messageService.query().subscribe((messages: Message[]) => {
      console.log("Retrieve called. Message length: ", messages.length, " MessageCount: ", this.msgCount);
      if (messages.length > this.msgCount || messages.length < this.msgCount) {
        this.msgCount = messages.length;
        this.messages.push(...messages);
      }
    });
  }

  public sendMessage(data: string) {
    this.channel.send({ message: data });
    this.addMessage(data);
  }

  public deleteMessage(message: Message) {
    this.messageService.delete(message).subscribe((response: any) => {
      this.messages = this.messages.filter((u: Message) => u.id != message.id);
    });
  }
}
