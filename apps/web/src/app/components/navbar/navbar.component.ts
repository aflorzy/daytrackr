import { Component, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { AuthActions } from "../../store/actions/auth.actions";
import { selectIsAuthenticatedUser } from "../../store/selectors/auth.selector";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent {
  private store = inject(Store);

  isAuthenticatedUser$ = this.store.select(selectIsAuthenticatedUser);

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
