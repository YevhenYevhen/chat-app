import { Component, OnInit } from '@angular/core';
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

  constructor(private readonly chatService: ChatService) {}

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
}
