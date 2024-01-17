import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BASE_URL } from "../../common/constants";

export interface FeedbackMessage {
  subject: string;
  body: string;
  attachments: any[];
}

@Injectable({
  providedIn: "root"
})
export class FeedbackService {
  constructor(private http: HttpClient) {}

  public sendFeedback(feedback: FeedbackMessage): Observable<any> {
    return this.http.post(`${BASE_URL}/feedback`, feedback);
  }
}
