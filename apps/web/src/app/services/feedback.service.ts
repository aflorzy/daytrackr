import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, take } from "rxjs";
import { BASE_URL } from "../constants";
import { FeedbackMessage, ResponseMessage } from "../interfaces";

@Injectable({
  providedIn: "root"
})
export class FeedbackService {
  private http = inject(HttpClient);

  public sendFeedback(feedback: FeedbackMessage): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(`${BASE_URL}/feedback`, feedback).pipe(take(1));
  }
}
