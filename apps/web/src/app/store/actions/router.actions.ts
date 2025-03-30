import { createActionGroup, props } from "@ngrx/store";

export const RouterActions = createActionGroup({
  source: "Router",
  events: {
    navigate: props<{ route: string }>()
  }
});
