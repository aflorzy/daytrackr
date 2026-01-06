import { Component, inject } from "@angular/core";
import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { filter, Observable, tap } from "rxjs";
import { Profile, ProfileDTO } from "../../interfaces";
import { dirtyCheck } from "../../operators/dirty-check.operator";
import { ProfileActions } from "../../store/actions/profile.actions";
import { selectProfile, selectResponseMsg } from "../../store/selectors/profile.selectors";

@Component({
  selector: "app-profile-page",
  templateUrl: "./profile-page.component.html"
})
export class ProfilePageComponent {
  private store = inject(Store);
  private fb = inject(NonNullableFormBuilder);

  userForm = this.fb.group({
    firstName: [""],
    lastName: [""],
    preferredName: [""],
    email: ["", [Validators.email]],
    phone: ["", Validators.pattern(/^\d{10}$/)]
  });

  isDirty$: Observable<boolean> = this.userForm.valueChanges.pipe(dirtyCheck(this.store.select(selectProfile)));
  responseMsg$ = this.store.select(selectResponseMsg);
  profile$ = this.store.select(selectProfile).pipe(
    tap(profile => {
      if (!profile) this.store.dispatch(ProfileActions.getProfileDetails());
    }),
    filter(Boolean),
    tap(profile => this.patchForm(profile))
  );

  // Overwrite some form values
  private patchForm(data: Partial<Profile>) {
    this.userForm.patchValue(data);
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

  hasError(fieldName: string, error: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field?.touched && field?.hasError(error));
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      // Form is invalid, show error messages
      this.validateAllFormFields(this.userForm);

      return;
    }

    const formValue = this.userForm.value;
    const profileDto: ProfileDTO = {
      firstName: formValue.firstName ?? "",
      lastName: formValue.lastName ?? "",
      preferredName: formValue.preferredName ?? "",
      email: formValue.email ?? "",
      phone: formValue.phone ?? ""
    };

    this.store.dispatch(ProfileActions.saveProfileDetails({ profileDto }));
  }
}
