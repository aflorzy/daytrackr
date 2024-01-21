import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { AuthService } from "src/app/services/auth.service";
import { StatusType } from "../../enums";

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
    private authService: AuthService,
    private router: Router
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

    this.authService
      .register(this.username, this.password)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: { message: string; error: string }) => {
          this.successMessage = res.message;
          this.errorMessage = "";

          setTimeout(() => this.router.navigate(["login"]), 2000);
        },
        error: (e: HttpErrorResponse) => {
          this.successMessage = "";
          this.errorMessage = e.error.error;
        }
      });
  }
}
