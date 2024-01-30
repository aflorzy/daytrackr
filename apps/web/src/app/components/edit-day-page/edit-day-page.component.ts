import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Day, Event } from "../../interfaces";
import { EditDayActions } from "../../store/actions/edit-day.actions";
import { selectEditingDay, selectIsChanged } from "../../store/selectors/edit-day.selector";
import { selectRouteParam } from "../../store/selectors/router.selectors";

@Component({
  selector: "app-edit-day-page",
  templateUrl: "./edit-day-page.component.html",
  styleUrls: ["./edit-day-page.component.css"]
})
export class EditDayPageComponent implements OnInit {
  date$: Observable<string | undefined> = this.store.select(selectRouteParam("date"));
  day$: Observable<Day> = this.store.select(selectEditingDay);
  isChanged$: Observable<boolean> = this.store.select(selectIsChanged);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(EditDayActions.loadDay());
  }

  saveEdits() {
    this.store.dispatch(EditDayActions.saveEdits());
  }

  cancelEdit() {
    this.store.dispatch(EditDayActions.cancelEdits());
  }

  moveEventUp(event: Event) {
    this.store.dispatch(EditDayActions.moveEventUp({ event }));
  }

  moveEventDown(event: Event) {
    this.store.dispatch(EditDayActions.moveEventDown({ event }));
  }

  removeEvent(event: Event) {
    this.store.dispatch(EditDayActions.removeEvent({ event }));
  }

  addEvent(name: string) {
    this.store.dispatch(EditDayActions.addEvent({ name }));
  }
}
