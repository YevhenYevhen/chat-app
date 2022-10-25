import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { UiComponent } from '../../../abstract/ui-component/ui-component.component';
import { AuthUserStore } from '../../../store/auth-user.store';
import { UsersStore } from '../../../store/users.store';
import { colors } from './users.colors';
import { UsersService } from './users.service';

@Component({
  selector: 'chat-app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent extends UiComponent implements OnInit {
  public isAdmin!: boolean;
  public users$ = this.usersStore.users$;

  constructor(
    private authUserStore: AuthUserStore,
    private usersStore: UsersStore,
    private usersService: UsersService
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.authUserStore.authUser$ !== null) {
      this.isAdmin = this.authUserStore.authUser$.getValue()!.role === 'admin';
    }

    this.loadUsers();

    this.usersService
      .userMuted()
      .pipe(takeUntil(this.notifier$))
      .subscribe((id) => {
        const users = this.usersStore.users$
          .getValue()
          .map((u) => (u.id === id ? { ...u, muted: true } : u));

        this.usersStore.users$.next(users);
      });

    this.usersService
      .userUnmuted()
      .pipe(takeUntil(this.notifier$))
      .subscribe((id) => {
        const users = this.usersStore.users$
          .getValue()
          .map((u) => (u.id === id ? { ...u, muted: false } : u));

        this.usersStore.users$.next(users);
      });

    this.usersService
      .userBanned()
      .pipe(takeUntil(this.notifier$))
      .subscribe((id) => {
        const users = this.usersStore.users$
          .getValue()
          .map((u) => (u.id === id ? { ...u, banned: true } : u));

        this.usersStore.users$.next(users);
      });

    this.usersService
      .userUnbanned()
      .pipe(takeUntil(this.notifier$))
      .subscribe((id) => {
        const users = this.usersStore.users$
          .getValue()
          .map((u) => (u.id === id ? { ...u, banned: false } : u));

        this.usersStore.users$.next(users);
      });
  }

  private loadUsers(): void {
    if (this.isAdmin) {
      this.usersService
        .getAllUsers()
        .pipe(takeUntil(this.notifier$))
        .subscribe((users) => {
          this.usersStore.users$.next(
            users.map((u) => ({ ...u, color: this.getColor() }))
          );
        });
    } else {
      this.usersService
        .getOnlineUsers()
        .pipe(takeUntil(this.notifier$))
        .subscribe((users) =>
          this.usersStore.users$.next(
            users.map((u) => ({ ...u, color: this.getColor() }))
          )
        );
    }
  }

  public muteUser(id: string): void {
    if (!this.isAdmin) return;
    this.usersService.mute(id);
  }

  public async unmuteUser(id: string): Promise<void> {
    if (!this.isAdmin) return;
    this.usersService.unmute(id);
  }

  public banUser(id: string): void {
    if (!this.isAdmin) return;
    this.usersService.banUser(id);
  }

  public unbanUser(id: string): void {
    if (!this.isAdmin) return;
    this.usersService.unbanUser(id);
  }

  public getColor(): string {
    const index = Math.floor(Math.random() * colors.length);
    return colors[index];
  }
}