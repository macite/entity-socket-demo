import { Injectable, NgZone } from '@angular/core';
import * as ActionCable from 'actioncable';

@Injectable({
  providedIn: 'root'
})
export class ActionCableService {
  private consumer: any;
  constructor() {}
  
  public subscribeMe() {
    this.consumer = ActionCable.createConsumer(`ws://localhost:3000/cable`);
    console.log("Trying connection");
    this.consumer.subscriptions.create("RoomChannel", {
      connected() {
        console.log("Subscription is ready for use");
      },
      disconnected() {
        console.log("Service terminated by WB server");
      },
      received(data: any) {
        console.log("This is the data received: ", data);
      }
    })
  }
}