import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BASE_URL } from "../constants";
import { Profile } from "../interfaces";

@Injectable({
  providedIn: "root"
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  save(profile: Profile): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/profile`, profile);
  }

  fetchProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${BASE_URL}/profile`);
  }
}
