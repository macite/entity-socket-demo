import { HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Conversation } from "src/app/model/conversation";
import { Message } from "src/app/model/message";
import { ConversationService } from "src/app/model/conversation.service";
import { MessageService } from "src/app/model/message.service";
import * as ActionCable from 'actioncable';

@Component({
  selector: 'message-list',
  templateUrl: 'message-list.component.html',
  styleUrls: ['message-list.component.css'],
})
export class MessageListComponent implements OnInit {
  conversations: Conversation[] = new Array<Conversation>();
  conversation: Conversation = new Conversation();
  messages: Message[] = new Array<Message>();
  private consumer: any;
  private channel: any;
  editdata:any;
  isEdit:boolean=false;

  constructor(
    private conversationService: ConversationService, private messageService: MessageService
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

    this.conversationService.query().subscribe(
      (conversations: Conversation[]) => {
        this.conversations.push(...conversations);
      }
    );
  }

  public addConversation(sender_id: string, recipient_id: string) {
    const data = {
      sender_id: sender_id,
      recipient_id: recipient_id,
    }

    this.conversationService.create(data).subscribe(
      (conversation: Conversation) => {
        this.conversations.push(conversation);
      }
    );
  }

  public getConversationMessages(conversation: Conversation){
    this.conversation = conversation
    let conversation_id = conversation.id
    let path = 'rooms/'+conversation_id+'/messages'
    //@ts-ignore
    this.conversationService.get_messages(conversation_id, 'messages').subscribe((messages: Message[]) => {
        this.messages = messages
      }
    );
  }

  public createMessage(content: string, user_id: string){
    const data = {
      content: content,
      user_id: user_id,
      conversation_id: this.conversation.id
    }

    this.messageService.create(data).subscribe(
      (message: Message) => {
        this.messages.push(message);
      }
    );
  }

  public deleteRoom(conversation: Conversation){
    this.conversationService.delete(conversation).subscribe( (response : any) => { this.conversations = this.conversations.filter( (u: Conversation) => u.id != conversation.id ) } );
  }
}
