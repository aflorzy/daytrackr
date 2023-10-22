import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from '../../services/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private storageService: StorageService) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  get username(): string {
    return this.registerForm.get('username')?.value;
  }
  get usernameField() {
    return this.registerForm.get('username');
  }

  get password(): string {
    return this.registerForm.get('password')?.value;
  }
  get passwordField() {
    return this.registerForm.get('password');
  }

  get confirmPassword(): string {
    return this.registerForm.get('confirmPassword')?.value;
  }
  get confirmPasswordField() {
    return this.registerForm.get('confirmPassword');
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.authService.register(this.username, this.password).subscribe({
      next: (res: string) => {
        this.successMessage = res;
        this.errorMessage = '';
        // Set credentials in storage. Will remove immediatly after using in Login
        this.storageService.setItemInStorage('credentials', { username: this.username, password: this.password });
        this.router.navigate(['/login']);
      },
      error: (e: HttpErrorResponse) => {
        this.successMessage = '';
        this.errorMessage = e.error;
        console.error('Could not register user', e.error);
      },
    });
  }
}
