import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IAuthUser } from '../models/auth-user.model';
@Injectable({
  providedIn: 'root',
})
export class UserStore {
  public user$: BehaviorSubject<IAuthUser | null> =
    new BehaviorSubject<IAuthUser | null>(null);
}
