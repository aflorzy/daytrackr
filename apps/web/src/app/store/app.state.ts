import { State as DayState } from "./reducers/day.reducer";

export interface AppState {
  days: DayState;
}
