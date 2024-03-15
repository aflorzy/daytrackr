import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { AuthActions } from "src/app/store/actions/auth.actions";
import { selectIsAuthenticatedUser } from "src/app/store/selectors/auth.selector";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent {
  isAuthenticatedUser$ = this.store.select(selectIsAuthenticatedUser);

  constructor(private store: Store) {}

  public logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
