import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ChatModule } from './components/chat/chat.module';
import { AppRoutingModule } from './app-routing.module';

const config: SocketIoConfig = {
  url: 'http://localhost:3333',
  options: {
    transports: ['websocket', 'polling'],
    query: {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNGVjZmQxNmJhMTM2MjFiNjU2NGFiNiIsImlhdCI6MTY2NjE5NTQwMywiZXhwIjoxNjY2MjgxODAzfQ._m6cfK0WWkc01rWjXycDIm3BTiNIary_d3PIgDCW7Rc',
    },
  },
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    ChatModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
