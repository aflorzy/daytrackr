import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import * as jwt_decode from "jwt-decode";
import { Observable, Subscription, delay, of, tap } from "rxjs";
import { AccessToken } from "src/app/interfaces";
import { BASE_URL } from "../constants";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private jwtExpirationSubscription = new Subscription();

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router
  ) {}

  public get token(): AccessToken {
    return this.storageService.getItemFromStorage("token");
  }

  public set token(token: AccessToken) {
    this.storageService.setItemInStorage("token", token);
  }

  public get isAuthenticatedUser(): boolean {
    return this.tokenValid;
  }

  private get tokenValid(): boolean {
    const token = this.token;
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
        this.logout();
      });
  }

  public logout() {
    this.storageService.removeItemFromStorage("token");
    this.jwtExpirationSubscription.unsubscribe();
    this.router.navigate(["login"]);
  }

  public register(username: string, password: string): Observable<{ message: string; error: string }> {
    const registerUrl = `${BASE_URL}/auth/register`;

    const registerData = {
      username: username,
      password: password
    };

    return this.http.post<any>(registerUrl, registerData, { responseType: "json" });
  }

  public login(username: string, password: string): Observable<AccessToken> {
    const loginUrl = `${BASE_URL}/auth/login`;

    const loginData = {
      username: username,
      password: password
    };

    return this.http.post<AccessToken>(loginUrl, loginData).pipe(
      tap((response: AccessToken) => {
        this.token = response;
        this.startJwtExpirationCounter(response);
      })
    );
  }
}
