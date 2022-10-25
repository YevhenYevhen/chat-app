import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../../../models/user.model';
import { SocketWithToken } from '../../../shared/socket-with-token';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private socket: SocketWithToken) {}
  public mute(id: string): void {
    this.socket.emit('muteUser', id);
  }

  public userMuted(): Observable<string> {
    return this.socket.fromEvent<string>('userMuted');
  }

  public unmute(id: string): void {
    this.socket.emit('unmuteUser', id);
  }

  public userUnmuted(): Observable<string> {
    return this.socket.fromEvent<string>('userUnmuted');
  }

  public disconnected(): Observable<void> {
    return this.socket.fromEvent<void>('disconnect');
  }

  public banUser(id: string): void {
    this.socket.emit('banUser', id);
  }

  public userBanned(): Observable<string> {
    return this.socket.fromEvent<string>('userBanned');
  }

  public unbanUser(id: string): void {
    this.socket.emit('unbanUser', id);
  }

  public userUnbanned(): Observable<string> {
    return this.socket.fromEvent<string>('userUnbanned');
  }

  public getOnlineUsers(): Observable<IUser[]> {
    this.socket.emit('getOnlineUsers');
    return this.socket.fromEvent<IUser[]>('onlineUsers');
  }

  public getAllUsers(): Observable<IUser[]> {
    this.socket.emit('getAllUsers');
    return this.socket.fromEvent<IUser[]>('allUsers');
  }
}
