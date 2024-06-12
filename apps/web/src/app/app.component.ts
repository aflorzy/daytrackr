import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { AuthActions } from "./store/actions/auth.actions";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "DayTrackr";

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(AuthActions.checkForToken());
  }
}
