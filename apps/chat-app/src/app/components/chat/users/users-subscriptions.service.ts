import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { IUser } from '../../../models/user.model';
import { AuthUserStore } from '../../../store/auth-user.store';
import { UsersStore } from '../../../store/users.store';
import { AuthService } from '../../auth/auth.service';
import { ColorsService } from './colors.service';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class UsersSubscriptionsService {
  constructor(
    private usersService: UsersService,
    private usersStore: UsersStore,
    private authUserStore: AuthUserStore,
    private authService: AuthService,
    private router: Router,
    private colorsService: ColorsService
  ) {}
  private isAdmin = this.authUserStore.authUser$?.getValue()!.role === 'admin';
  private users$ = this.usersStore.users$;
  private get users(): IUser[] {
    return this.users$.getValue();
  }

  private disconnectionSubcription(notifier$: Subject<void>): void {
    this.usersService
      .userDisonnected()
      .pipe(takeUntil(notifier$))
      .subscribe((user) => {
        let users;

        if (this.isAdmin) {
          users = this.users.map((u) =>
            u.id === user.id ? { ...u, online: false } : u
          );
        } else {
          users = this.users.filter((u) => u.id !== user.id);
        }

        this.users$.next(users);
      });
  }

  private connectionSubcription(notifier$: Subject<void>): void {
    this.usersService
      .userConnected()
      .pipe(takeUntil(notifier$))
      .subscribe((user) => {
        const userExists = !!this.users.find((u) => u.id === user.id);

        if (this.isAdmin && userExists) {
          this.users$.next(this.users.map((u) => (u.id === user.id ? { ...u, online: true } : u)));
          return;
        }

        if (this.isAdmin && !userExists) {
          this.users$.next([{ ...user, color: this.colorsService.getColor(), online: true }, ...this.users ]);
          return;
        }

        this.users$.next([user, ...this.users]);
      });
  }

  private muteSubcription(notifier$: Subject<void>): void {
    this.usersService
      .userMuted()
      .pipe(takeUntil(notifier$))
      .subscribe((id) => {
        this.users$.next(
          this.users.map((u) => (u.id === id ? { ...u, muted: true } : u))
        );
      });
  }

  private unmuteSubcription(notifier$: Subject<void>): void {
    this.usersService
      .userUnmuted()
      .pipe(takeUntil(notifier$))
      .subscribe((id) => {
        this.users$.next(
          this.users.map((u) => (u.id === id ? { ...u, muted: false } : u))
        );
      });
  }

  private banSubcription(notifier$: Subject<void>): void {
    this.usersService
      .userBanned()
      .pipe(takeUntil(notifier$))
      .subscribe((id) => {
        if (this.isAdmin) {
          const users = this.users.map((u) =>
              u.id === id ? { ...u, banned: true, online: false } : u
            );

          this.users$.next(users);
        }

        if (!this.isAdmin) {
          this.users$.next(
            this.users.filter((u) => u.id !== id)
          );
        }

        if (id === this.authUserStore.authUser$.getValue()?.id) {
          this.authService.logout();
          this.router.navigateByUrl('/auth/login');
          this.usersService.disconnectUser(id);
        }
      });
  }

  private unbanSubcription(notifier$: Subject<void>): void {
    this.usersService
      .userUnbanned()
      .pipe(takeUntil(notifier$))
      .subscribe((id) => {
        this.users$.next(
          this.users.map((u) => (u.id === id ? { ...u, banned: false } : u))
        );
      });
  }

  public subscribe(notifier$: Subject<void>): void {
    this.usersService.connect();

    this.disconnectionSubcription(notifier$);
    this.connectionSubcription(notifier$);
    this.muteSubcription(notifier$);
    this.unmuteSubcription(notifier$);
    this.banSubcription(notifier$);
    this.unbanSubcription(notifier$);
  }
}
