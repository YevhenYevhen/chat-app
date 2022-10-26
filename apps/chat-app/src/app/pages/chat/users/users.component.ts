import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { UiComponent } from '../../../abstract/ui-component/ui-component.component';
import { AuthUserStore } from '../../../store/auth-user.store';
import { UsersStore } from '../../../store/users.store';
import { ColorsService } from './colors.service';
import { UsersSubscriptionsService } from './users-subscriptions.service';
import { UsersService } from './users.service';

@Component({
  selector: 'chat-app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent extends UiComponent implements OnInit, OnDestroy {
  public isAdmin = this.authUserStore.authUser$?.getValue()?.role === 'admin';
  public users$ = this.usersStore.users$;
  @ViewChild('drawer') public drawer!: MatSidenav;
  @Input() closeDrawer$!: Subject<void>;

  constructor(
    public authUserStore: AuthUserStore,
    private usersStore: UsersStore,
    private usersService: UsersService,
    private usersSubscriptions: UsersSubscriptionsService,
    private colorsService: ColorsService,
    private cdRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadUsers();
    this.usersSubscriptions.subscribe(this.notifier$);
    this.closeDrawer$.pipe(takeUntil(this.notifier$)).subscribe(() => {
      this.drawer.close();
      this.cdRef.markForCheck();
    });
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.usersService.disconnect();
  }

  private async loadUsers(): Promise<void> {
    const users = this.isAdmin
      ? await this.usersService.getAllUsers()
      : await this.usersService.getOnlineUsers();

    this.usersStore.users$.next(
      users.map((u) => ({ ...u, color: this.colorsService.getColor() }))
    );
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
    if (!this.isAdmin || id === this.authUserStore.authUser$.getValue()?.id)
      return;
    this.usersService.banUser(id);
  }

  public unbanUser(id: string): void {
    if (!this.isAdmin) return;
    this.usersService.unbanUser(id);
  }
}
