import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { StatusType } from "../../enums";
import { Store } from "@ngrx/store";
import { AuthActions } from "src/app/store/actions/auth.actions";

@UntilDestroy()
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html"
})
export class RegisterComponent {
  registerForm: FormGroup;
  successMessage = "";
  errorMessage = "";

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.registerForm = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", [Validators.required]]
    });
  }

  get username(): string {
    return this.registerForm.get("username")?.value;
  }
  get usernameField() {
    return this.registerForm.get("username");
  }

  get password(): string {
    return this.registerForm.get("password")?.value;
  }
  get passwordField() {
    return this.registerForm.get("password");
  }

  get confirmPassword(): string {
    return this.registerForm.get("confirmPassword")?.value;
  }
  get confirmPasswordField() {
    return this.registerForm.get("confirmPassword");
  }

  get StatusType() {
    return StatusType;
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Passwords do not match.";
      return;
    }

    this.store.dispatch(AuthActions.register({ username: this.username, password: this.password }));
  }
}
