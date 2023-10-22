import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(private authService: AuthService) {}

  public get isAuthenticatedUser(): boolean {
    return this.authService.isAuthenticatedUser;
  }

  public logout() {
    this.authService.logout();
  }
}
