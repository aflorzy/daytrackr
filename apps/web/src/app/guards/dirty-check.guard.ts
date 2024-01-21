import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { Observable, of, switchMap, take } from "rxjs";

export interface DirtyComponent {
  isDirty$: Observable<boolean>;
}

@Injectable({ providedIn: "root" })
export class DirtyCheckGuard implements CanDeactivate<DirtyComponent> {
  canDeactivate(component: DirtyComponent) {
    return component.isDirty$.pipe(
      switchMap(dirty => {
        if (dirty === false) {
          return of(true);
        }
        const navigate = confirm("You have unsaved changes. Are you sure you want to leave?");
        return of(navigate);
      }),
      take(1)
    );
  }
}
