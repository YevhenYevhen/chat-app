import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { UiComponent } from '../../../abstract/ui-component/ui-component.component';
import { MessagesStore } from '../../../store/messages.store';
import { AuthUserStore } from '../../../store/auth-user.store';
import { MessagesService } from './messages.service';
import { UsersStore } from '../../../store/users.store';
import { IUser } from '../../../models/user.model';

@Component({
  selector: 'chat-app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent extends UiComponent implements OnInit {
  public messsages$ = this.messagesStore.messages$;
  public users!: IUser[];
  public authUser = this.authUserStore.authUser$.getValue();
  public messageForm!: FormGroup;

  constructor(
    private messagesService: MessagesService,
    private messagesStore: MessagesStore,
    private authUserStore: AuthUserStore,
    private usersStore: UsersStore,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.getAllMessages();
    this.subscribeToNewMessages();

    this.usersStore.users$
      .pipe(takeUntil(this.notifier$))
      .subscribe((users) => (this.users = users));

    this.messageForm = this.fb.group({
      messageText: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  public onSubmit(): void {
    if (this.messageForm.invalid) return;

    this.messagesService.sendMessage(
      this.messageForm.getRawValue().messageText
    );
  }

  private subscribeToNewMessages(): void {
    this.messagesService
      .getNewMessage()
      .pipe(takeUntil(this.notifier$))
      .subscribe((m) => {
        this.messagesStore.messages$.next([...this.messagesStore.messages, m]);
        this.messageForm.reset();
      });
  }

  private async getAllMessages(): Promise<void> {
    this.messagesStore.messages$.next(
      await this.messagesService.getAllMessages()
    );
  }

  public getUserColor(id: string): string {
    return this.users.find((u) => u.id === id)?.color || 'black';
  }
}
