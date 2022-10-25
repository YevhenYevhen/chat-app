import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ChatModule } from './components/chat/chat.module';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { MatModule } from './shared/mat.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from './components/auth/auth.module';

const config: SocketIoConfig = {
  url: 'http://localhost:3333',
  options: {
    transports: ['websocket', 'polling'],
    autoConnect: false
  },
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    SocketIoModule.forRoot(config),
    ChatModule,
    MatModule,
    AuthModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
