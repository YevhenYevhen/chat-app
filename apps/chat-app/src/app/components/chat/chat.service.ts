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

  public mute(id: string): void {
    this.socket.emit('muteUser', id);
  }

  public userMuted(): Observable<void> {
    return this.socket.fromEvent<void>('userMuted');
  }

  public unmute(id: string): void {
    this.socket.emit('unmuteUser', id);
  }

  public userUnmuted(): Observable<void> {
    return this.socket.fromEvent<void>('userUnmuted');
  }

  public disconnected(): Observable<void> {
    return this.socket.fromEvent<void>('disconnect');
  }

  public banUser(id: string): void {
    this.socket.emit('banUser', id);
  }

  public userBanned(): Observable<void> {
    return this.socket.fromEvent<void>('userBanned');
  }

  public unbanUser(id: string): void {
    this.socket.emit('unbanUser', id);
  }

  public userUnbanned(): Observable<void> {
    return this.socket.fromEvent<void>('userUnbanned');
  }

  public getOnlineUsers(): Observable<unknown> {
    this.socket.emit('getOnlineUsers');
    return this.socket.fromEvent<unknown>('onlineUsers');
  }

  public getAllUsers(): Observable<unknown> {
    this.socket.emit('getAllUsers');
    return this.socket.fromEvent<unknown>('allUsers');
  }

  public getAllMessages(): Observable<unknown> {
    this.socket.emit('getAllMessages');
    return this.socket.fromEvent<unknown>('allMessages');
  }
}
