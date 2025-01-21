import { inject, Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, delay, map, mergeMap, of, switchMap } from "rxjs";
import { StatusType } from "src/app/enums";
import { ProfileService } from "src/app/services/profile.service";
import { ProfileDTO, ResponseMessage } from "../../interfaces";
import { ProfileActions, ProfileApiActions } from "../actions/profile.actions";
import { selectResponseMsg } from "../selectors/profile.selectors";

@Injectable()
export class ProfileEffects {
  private action$ = inject(Actions);
  private store = inject(Store);
  private profileService = inject(ProfileService);

  loadProfile$ = createEffect(() => {
    return this.action$.pipe(
      ofType(ProfileActions.getProfileDetails),
      switchMap(() =>
        this.profileService.fetchProfile().pipe(
          map((profileDto: ProfileDTO) => ProfileApiActions.retrieveProfileSuccess({ profileDto })),
          catchError((error: { message: string }) =>
            of(ProfileApiActions.retrieveProfileFailure({ errorMsg: error.message }))
          )
        )
      )
    );
  });

  saveProfile$ = createEffect(() => {
    return this.action$.pipe(
      ofType(ProfileActions.saveProfileDetails),
      switchMap(payload =>
        this.profileService.save(payload.profileDto).pipe(
          switchMap((responseMsg: ResponseMessage) =>
            of(
              ProfileApiActions.saveProfileSuccess({ responseMsg }),
              ProfileApiActions.retrieveProfileSuccess({ profileDto: payload.profileDto })
            )
          ),
          catchError((error: { message: string }) =>
            of(ProfileApiActions.saveProfileFailure({ errorMsg: error.message }))
          )
        )
      )
    );
  });

  // Hide response message after timer
  hideResponseMsg$ = createEffect(() => {
    return this.action$.pipe(
      ofType(ProfileApiActions.saveProfileSuccess),
      concatLatestFrom(() => this.store.select(selectResponseMsg)),
      mergeMap(([_, responseMsg]: [any, ResponseMessage]) => {
        if (responseMsg.message)
          return of(
            ProfileActions.setResponseMessage({ responseMsg: { message: "", statusType: StatusType.NULL } })
          ).pipe(delay(5000));

        return of();
      })
    );
  });
}
