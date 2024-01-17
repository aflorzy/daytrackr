import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-profile-page",
  templateUrl: "./profile-page.component.html",
  styleUrls: ["./profile-page.component.css"]
})
export class ProfilePageComponent implements OnInit {
  userForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.userForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      preferredName: [""],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", Validators.pattern(/^\d{10}$/)]
    });
  }

  get userFormControls() {
    return this.userForm.controls;
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      // Form is valid, perform your action here
      console.log("Form submitted:", this.userForm.value);
    } else {
      // Form is invalid, show error messages
      this.validateAllFormFields(this.userForm);
    }
  }

  private validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }
}
