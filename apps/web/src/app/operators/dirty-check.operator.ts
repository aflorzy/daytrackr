import * as _ from "lodash";
import {
  Observable,
  Subscription,
  combineLatest,
  debounceTime,
  finalize,
  fromEvent,
  map,
  shareReplay,
  startWith
} from "rxjs";

/**
 * Implemented from https://netbasal.com/detect-unsaved-changes-in-angular-forms-75fd8f5f1fa6
 */
export function dirtyCheck<U>(source: Observable<U>) {
  let subscription: Subscription;
  const isDirty = false;

  return function <T>(valueChanges: Observable<T>): Observable<boolean> {
    const isDirty$ = combineLatest(source, valueChanges).pipe(
      debounceTime(300),
      map(([a, b]: [U, T]) => {
        // Irrespective of key order
        return !_.isEqual(a, b);

        // Keys must be in same order
        // return JSON.stringify(a) !== JSON.stringify(b);

        // Only works for primitives
        // return isEqual(a as any, b as any) === false;
      }),
      finalize(() => subscription.unsubscribe()),
      startWith(false),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    subscription = fromEvent(window, "beforeunload").subscribe(event => {
      isDirty && (event.returnValue = false);
    });

    return isDirty$;
  };
}
