import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { UiComponent } from '../../../abstract/ui-component/ui-component.component';
import { MessagesStore } from '../../../store/messages.store';
import { UserStore } from '../../../store/user.store';
import { MessagesService } from './messages.service';

@Component({
  selector: 'chat-app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent extends UiComponent implements OnInit {
  public messsages$ = this.messagesStore.messages$;
  public authUser = this.userStore.user$.getValue();
  public messageForm!: FormGroup;

  constructor(
    private messagesService: MessagesService,
    private messagesStore: MessagesStore,
    private userStore: UserStore,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.getAllMessages();
    this.subscribeToNewMessages();

    this.messageForm = this.fb.group({
      messageText: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  public onSubmit(): void {
    if (this.messageForm.invalid) return;

    this.messagesService.sendMessage(
      this.messageForm.getRawValue().messageText
    );

    this.messageForm.reset();
  }

  private subscribeToNewMessages(): void {
    this.messagesService
      .getNewMessage()
      .pipe(takeUntil(this.notifier$))
      .subscribe((m) =>
        this.messagesStore.messages$.next([...this.messagesStore.messages, m])
      );
  }

  private async getAllMessages(): Promise<void> {
    this.messagesStore.messages$.next(
      await this.messagesService.getAllMessages()
    );
  }
}
