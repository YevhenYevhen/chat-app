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
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNTE0ZWFiZGE5ZWZlMWI2NmVkNmU2ZiIsImlhdCI6MTY2NjI3MzIzMCwiZXhwIjoxNjY2MzU5NjMwfQ.njOOxAzTBJp8v4sZzTIhAcxiRlKMchX1vqRv0VkR7tQ',
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
