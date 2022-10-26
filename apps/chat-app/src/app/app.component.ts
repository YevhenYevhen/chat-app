import { Component, OnInit } from '@angular/core';
import { AuthService } from './pages/auth/auth.service';

@Component({
  selector: 'chat-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.autoLogin();
  }
}
