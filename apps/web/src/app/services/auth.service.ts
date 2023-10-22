import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccessToken } from 'src/common/interfaces';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private base_url = 'http://localhost:8082/api';
  private isAuthenticated: boolean = false;

  constructor(private http: HttpClient, private storageService: StorageService) {}

  public get token(): AccessToken {
    return this.storageService.getItemFromStorage('token');
  }

  public set token(token: AccessToken) {
    this.storageService.setItemInStorage('token', token);
  }

  register(username: string, password: string): Observable<string> {
    const registerUrl = `${this.base_url}/auth/register`;

    const registerData = {
      username: username,
      password: password,
    };

    return this.http.post<any>(registerUrl, registerData, {responseType: 'json'});
  }

  login(username: string, password: string): Observable<AccessToken> {
    const loginUrl = `${this.base_url}/auth/login`;

    const loginData = {
      username: username,
      password: password,
    };

    return this.http.post<AccessToken>(loginUrl, loginData);
  }

  logout() {
    this.isAuthenticated = false;
    this.storageService.removeItemFromStorage('token');
  }

  public get isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }
}
