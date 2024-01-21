import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BASE_URL } from "../constants";

export class Profile {
  firstName: string;
  lastName: string;
  preferredName: string;
  email: string;
  phone: string;

  constructor(firstName = "", lastName = "", preferredName = "", email = "", phone = "") {
    this.firstName = firstName;
    this.lastName = lastName;
    this.preferredName = preferredName;
    this.email = email;
    this.phone = phone;
  }

  public getFirstName(): string {
    return this.preferredName ?? this.firstName;
  }

  public getName(): string {
    return this.getFirstName();
  }

  public getFullName(): string {
    return `${this.getName()} ${this.lastName}`;
  }

  public getProperName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

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
