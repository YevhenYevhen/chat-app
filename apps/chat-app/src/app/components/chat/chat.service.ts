import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { IMessage } from '../../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: Socket) {}
  public sendMessage(message: string): void {
    this.socket.emit('sendMessage', { message });
  }

  public getNewMessage(): Observable<IMessage> {
    return this.socket.fromEvent<IMessage>('newMessage');
  }
}
