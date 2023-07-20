import { HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Message, MessageKind } from "src/app/model/message";
import { MessageService } from "src/app/services/message.service";
import * as ActionCable from 'actioncable';
import { Observable } from "rxjs";

@Component({
  selector: 'message-list',
  templateUrl: 'message-list.component.html',
  styleUrls: ['message-list.component.css'],
})
export class MessageListComponent implements OnInit {
  // messages: Message[] = new Array<Message>();
  private consumer: any;
  private channel: any;
  messages: Observable<Message[]> = this.messageService.cache.values;

  private messageKinds: Map<string, MessageKind> = new Map<string, MessageKind>();

  constructor(
    private messageService: MessageService
  ) {
    this.messageKinds.set('info', new MessageKind('info'));
    this.messageKinds.set('test', new MessageKind('test'));

    // Could also be in the service...
    messageService.mapping.constructorParams = this.messageKinds;
  }

  ngOnInit() {
    this.consumer = ActionCable.createConsumer(`ws://localhost:3001/cable`);
    this.channel = this.consumer.subscriptions.create('ChatChannel', {
      connected() {
        console.log("connected");
      },
      disconnected() {
        console.log("disconnected");
      },
      received: (msgContent: any) => ( console.log(msgContent))
    });

    this.messageService.query(undefined, {mappingCompleteCallback: (entity: Message) => console.log("Finished mapping message")}).subscribe(
      (messages: Message[]) => {
        console.log(messages);
      }
    );
  }

  public addMessage(content: string) {
    const data = new Message();

    data.content = content,
    data.kind = this.messageKinds.get('test');
    data.messageColor= 1;

    // let u: message = this.messages[0];
    // this.messageService.put<message>(u).subscribe( (message: message) => {console.log(message)} );
    this.messageService.store(data).subscribe(
      (message: Message) => {
        console.log(message);
      }
    );
  }

  public updateMessage(message: Message) {
    message.messageColor += 1;
    message.content += ` updated color to ${message.messageColor}`;
    this.messageService.update(message).subscribe( (response : any) => console.log(response) );
  }

  public messageHasChanges(message: Message): boolean {
    return message.hasChanges(this.messageService.mapping);
  }

  public changeMessage(message: Message) {
    message.messageColor += 1;
  }

  public deleteMessage(message: Message) {
    this.messageService.delete(message).subscribe( (response : any) => console.log(response) );
  }

}
