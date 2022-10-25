import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IMessage } from '../../models/message.model';
import { ChatService } from './chat.service';

@Component({
  selector: 'chat-app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  public messages: IMessage[] = [];

  constructor(
    private chatService: ChatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.chatService
    //   .userMuted()
    //   .subscribe((id) => console.log('user muted', id));
    // this.chatService
    //   .userUnmuted()
    //   .subscribe((id) => console.log('user unmuted', id));

    // this.chatService
    //   .userBanned()
    //   .subscribe((id) => console.log('user banned', id));

    // this.chatService
    //   .userUnbanned()
    //   .subscribe((id) => console.log('user unbanned', id));

    // this.chatService.getOnlineUsers().subscribe((users) => console.log(users));

    // this.chatService.getAllUsers().subscribe((users) => console.log(users));


    // this.chatService.disconnected().subscribe(() => {
    //   console.log('disconnected');

    //   this.router.navigateByUrl('');
    // });
  }
}
