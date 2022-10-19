import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatService } from './chat.service';

@Component({
  selector: 'chat-app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  private newMessage$!: Observable<string>;
  public messages: string[] = [];

  constructor(private readonly chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.getNewMessage().subscribe((m) => {
      this.messages.push(m);
    });
  }

  public onSubmit({ message }: { message: string }): void {
    this.chatService.sendMessage(message);
  }
}
