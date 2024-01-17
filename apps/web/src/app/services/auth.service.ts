import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as jwt_decode from "jwt-decode";
import { Observable } from "rxjs";
import { AccessToken } from "src/common/interfaces";
import { BASE_URL } from "../../common/constants";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService
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

  public get tokenValid(): boolean {
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

  public logout() {
    this.storageService.removeItemFromStorage("token");
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

    return this.http.post<AccessToken>(loginUrl, loginData);
  }
}
