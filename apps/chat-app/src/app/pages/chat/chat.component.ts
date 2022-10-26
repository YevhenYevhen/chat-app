import {
  Component,
  OnInit,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { UiComponent } from '../../abstract/ui-component/ui-component.component';
import { ChatService } from './chat.service';

@Component({
  selector: 'chat-app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent extends UiComponent implements OnInit {
  public closeDrawer$ = new Subject<void>();
  constructor(private chatService: ChatService, private snackBar: MatSnackBar) {
    super();
  }

  ngOnInit(): void {
    this.chatService
      .exception()
      .pipe(takeUntil(this.notifier$))
      .subscribe((exception) =>
        this.snackBar.open(exception.message, undefined, { duration: 3000 })
      );
  }

  public closeDrawer(): void {
    this.closeDrawer$.next();
  }
}
