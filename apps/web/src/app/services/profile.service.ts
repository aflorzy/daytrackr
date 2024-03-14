import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BASE_URL } from "../constants";
import { ProfileDTO, ResponseMessage } from "../interfaces";

@Injectable({
  providedIn: "root"
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  save(profile: ProfileDTO): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(`${BASE_URL}/profile`, profile);
  }

  fetchProfile(): Observable<ProfileDTO> {
    return this.http.get<ProfileDTO>(`${BASE_URL}/profile`);
  }
}
