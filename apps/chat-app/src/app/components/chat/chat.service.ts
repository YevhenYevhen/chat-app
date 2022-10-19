import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private socket: Socket // private authenticationService: AuthenticationService
  ) {
    // this.socket.ioSocket.io.opts.headers = {
    //   Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNGVjZmQxNmJhMTM2MjFiNjU2NGFiNiIsImlhdCI6MTY2NjE5NTEzNSwiZXhwIjoxNjY2MjgxNTM1fQ.clKz52-ZlU-41aArg-ZcmRtL1Q6wbQGdAWMYTA1VO-U`,
    // };
  }
  public sendMessage(message: string): void {
    this.socket.emit('sendMessage', message);
  }

  public getNewMessage(): Observable<string> {
    return this.socket.fromEvent<string>('newMessage');
  }
}
