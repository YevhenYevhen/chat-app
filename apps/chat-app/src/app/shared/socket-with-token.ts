import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class SocketWithToken extends Socket {
  constructor() {
    super({
      url: 'http://localhost:3333',
      options: {
        transports: ['websocket', 'polling'],
        query: {
          token: (() =>  localStorage.getItem('token')
          )(),
        },
      },
    });
  }
}
