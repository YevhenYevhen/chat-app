import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IMessage } from '../../models/message.model';
import { ChatService } from './chat.service';

@Component({
  selector: 'chat-app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  private newMessage$!: Observable<string>;
  public messages: IMessage[] = [];

  constructor(
    private readonly chatService: ChatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chatService.getNewMessage().subscribe((m) => {
      this.messages.push(m);
    });
    this.chatService
      .userMuted()
      .subscribe((id) => console.log('user muted', id));
    this.chatService
      .userUnmuted()
      .subscribe((id) => console.log('user unmuted', id));

    this.chatService
      .userBanned()
      .subscribe((id) => console.log('user banned', id));

    this.chatService
      .userUnbanned()
      .subscribe((id) => console.log('user unbanned', id));

    this.chatService.getOnlineUsers().subscribe((users) => console.log(users));

    this.chatService.getAllUsers().subscribe((users) => console.log(users));

    this.chatService.getAllMessages().subscribe((messages) => console.log(messages));



    this.chatService.disconnected().subscribe(() => {
      console.log('disconnected');

      this.router.navigateByUrl('');
    });
  }

  public onSubmit({ message }: { message: string }): void {
    this.chatService.sendMessage(message);
  }

  public mute(id: string): void {
    this.chatService.mute(id);
  }

  public unmute(id: string): void {
    this.chatService.unmute(id);
  }

  public ban(id: string): void {
    this.chatService.banUser(id);
  }

  public unban(id: string): void {
    this.chatService.unbanUser(id);
  }
}
