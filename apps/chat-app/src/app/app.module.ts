import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ChatModule } from './components/chat/chat.module';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';

const config: SocketIoConfig = {
  url: 'http://localhost:3333',
  options: {
    transports: ['websocket', 'polling'],
    query: {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNTI3ZGI1YWFkMjg2ZmNmODFjMWY1ZiIsImlhdCI6MTY2NjM1NjEyOSwiZXhwIjoxNjY2NDQyNTI5fQ.U4YVdSTEhmDruiDm5NEWbAHOZjr1hCsbeUFkc_QbASw',
    },
  },
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    SocketIoModule.forRoot(config),
    ChatModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
