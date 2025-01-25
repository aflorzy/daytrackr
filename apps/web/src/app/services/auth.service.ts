import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import * as jwt_decode from "jwt-decode";
import { delay, Observable, of, Subscription, take, tap } from "rxjs";
import { AccessToken } from "src/app/interfaces";
import { BASE_URL, StorageKey } from "../constants";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);

  private jwtExpirationSubscription = new Subscription();

  get token(): AccessToken {
    return this.getTokenFromStorage();
  }

  private setTokenInStorage(token: AccessToken): void {
    this.storageService.setItemInStorage(StorageKey.Token, token);
  }

  private removeTokenFromStorage(): void {
    this.storageService.removeItemFromStorage(StorageKey.Token);
  }

  private getTokenFromStorage(): AccessToken {
    return this.storageService.getItemFromStorage(StorageKey.Token);
  }

  public getTokenExpiration(token: AccessToken): number {
    const decoded = this.getDecodedAccessToken(token.accessToken);

    return (decoded.exp ?? 0) * 1000;
  }

  public isAuthenticatedUser(token: AccessToken): boolean {
    return this.tokenValid(token);
  }

  public isTokenValid(): boolean {
    return this.tokenValid(this.getTokenFromStorage());
  }

  private tokenValid(token: AccessToken): boolean {
    if (!token || !token.accessToken) return false;

    const decoded = this.getDecodedAccessToken(token.accessToken);
    const tokenExpired = Math.floor(new Date().getTime() / 1000) >= decoded.exp;

    return !tokenExpired;
  }

  private getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode.jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

  private startJwtExpirationCounter(token: AccessToken) {
    const decoded = this.getDecodedAccessToken(token.accessToken);
    this.jwtExpirationSubscription.unsubscribe();
    this.jwtExpirationSubscription = of(null)
      .pipe(delay(decoded.exp))
      .subscribe(() => {
        console.log("Token expired, logging out...");
        this.logout();
      });
  }

  public register(username: string, password: string) {
    const registerUrl = `${BASE_URL}/auth/register`;

    const registerData = {
      username: username,
      password: password
    };

    return this.http.post<{ message: string | null; error: string | null }>(registerUrl, registerData);
  }

  public login(username: string, password: string): Observable<AccessToken> {
    const loginUrl = `${BASE_URL}/auth/login`;

    const loginData = { username, password };

    // Check for existing VALID token in storage before making API call

    return this.http.post<AccessToken>(loginUrl, loginData).pipe(
      take(1),
      tap(token => {
        this.setTokenInStorage(token);
      })
    );
  }

  public refreshToken(): Observable<AccessToken> {
    console.log("Refreshing token");

    return of(this.token);
  }

  public logout() {
    this.removeTokenFromStorage();

    this.jwtExpirationSubscription.unsubscribe();
  }
}
