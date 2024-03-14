import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { catchError, delay, map, mergeMap, of, switchMap } from "rxjs";
import { ProfileDTO, ResponseMessage } from "../../interfaces";
import { ProfileActions, ProfileApiActions } from "../actions/profile.actions";
import { ProfileService } from "src/app/services/profile.service";
import { Store } from "@ngrx/store";
import { selectResponseMsg } from "../selectors/profile.selectors";
import { StatusType } from "src/app/enums";

@Injectable()
export class ProfileEffects {
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

  constructor(
    private action$: Actions,
    private profileService: ProfileService,
    private store: Store
  ) {}
}
