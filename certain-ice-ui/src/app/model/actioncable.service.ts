// import { Injectable, NgZone } from '@angular/core';
// import * as ActionCable from 'actioncable';
// @Injectable({
//   providedIn: 'root'
// })
// export class ActionCableService {
//   private consumer: any;

//   public subscribeMe(data:any) {
//     this.consumer = ActionCable.createConsumer(`ws://localhost:3000/cable`);
//     console.log("Trying connection");
//     const channel = this.consumer.subscriptions.create("ActionchatChannel", {
//       connected() {
//         console.log("Subscription is ready for use");
//         console.log(channel);
//         channel.send({message : data})
//       },
//       disconnected() {
//         console.log("Service terminated by WB server");
//       },
//       received(data: string) {
//         console.log("This is the data received: ", data);
//       },

//     });
//   }
// }