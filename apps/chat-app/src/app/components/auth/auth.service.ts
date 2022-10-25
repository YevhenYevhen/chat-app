import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, firstValueFrom, tap } from 'rxjs';
import { IAuthUser } from '../../models/auth-user.model';
import { IUserAuthData } from '../../models/user-auth-data.model';
import { UserStore } from '../../store/user.store';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private userStore: UserStore,
    private socket: Socket
  ) {}

  public signUp(data: IUserAuthData): Promise<void> {
    return firstValueFrom(
      this.http
        .post<void>(`${environment.apiUrl}/user`, data)
        .pipe(catchError(this.handleError))
    );
  }

  public login(data: IUserAuthData): Promise<IAuthUser> {
    return firstValueFrom(
      this.http
        .post<IAuthUser>(`${environment.apiUrl}/auth/login`, data)
        .pipe(tap(this.handleAuth.bind(this)), catchError(this.handleError))
    );
  }

  private handleAuth(data: IAuthUser): void {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    this.userStore.user$.next(data);
  }

  public autoLogin(): void {
    const userData = localStorage.getItem('user');

    if (userData) {
      this.userStore.user$.next(JSON.parse(userData));
    }
  }

  private handleError(error: HttpErrorResponse): Promise<never> {
    let errorMessage = 'An unknown error occured...';

    if (error && error.error.message) {
      errorMessage = Array.isArray(error.error.message)
        ? error.error.message.join(', ')
        : error.error.message;
    }

    return Promise.reject(errorMessage);
  }
}
