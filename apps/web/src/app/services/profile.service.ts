import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, take } from "rxjs";
import { BASE_URL } from "../constants";
import { ProfileDTO, ResponseMessage } from "../interfaces";

@Injectable({
  providedIn: "root"
})
export class ProfileService {
  private http = inject(HttpClient);

  save(profile: ProfileDTO): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(`${BASE_URL}/profile`, profile).pipe(take(1));
  }

  fetchProfile(): Observable<ProfileDTO> {
    return this.http.get<ProfileDTO>(`${BASE_URL}/profile`).pipe(take(1));
  }
}
