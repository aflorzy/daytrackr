import { Observable, of, switchMap, take } from "rxjs";

export interface DirtyComponent {
  isDirty$: Observable<boolean>;
}

export const canDeactivateDirty = (component: DirtyComponent): Observable<boolean> => {
  return component.isDirty$.pipe(
    switchMap(dirty => {
      if (!dirty) return of(true);

      const navigate = confirm("You have unsaved changes. Are you sure you want to leave?");

      return of(navigate);
    }),
    take(1)
  );
};
