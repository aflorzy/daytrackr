import { Component, inject, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { AuthActions } from "./store/actions/auth.actions";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  private store = inject(Store);

  title = "DayTrackr";

  ngOnInit(): void {
    this.store.dispatch(AuthActions.checkForToken());
  }
}
