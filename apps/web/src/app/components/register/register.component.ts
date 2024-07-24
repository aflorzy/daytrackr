import { Component } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { AuthActions } from "src/app/store/actions/auth.actions";
import { StatusType } from "../../enums";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html"
})
export class RegisterComponent {
  registerForm = this.fb.group({
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl("", [Validators.required])
  });

  successMessage = "";
  errorMessage = "";

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {}

  get usernameField() {
    return this.registerForm.get("username");
  }

  get passwordField() {
    return this.registerForm.get("password");
  }

  get passwordsMatch(): boolean {
    return this.registerForm.get("password")?.value === this.registerForm.get("confirmPassword")?.value;
  }

  get confirmPasswordField() {
    return this.registerForm.get("confirmPassword");
  }

  get StatusType() {
    return StatusType;
  }

  onSubmit() {
    if (!this.passwordsMatch) {
      this.errorMessage = "Passwords do not match.";
      return;
    }

    const username = this.usernameField?.value ?? "";
    const password = this.passwordField?.value ?? "";

    this.store.dispatch(AuthActions.register({ username, password }));
  }
}
