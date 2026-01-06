import { Component, Input } from "@angular/core";
import { Day } from "@fzt/calendar";

@Component({
  selector: "app-day-list",
  templateUrl: "./day-list.component.html",
  styleUrls: ["./day-list.component.scss"]
})
export class DayListComponent {
  @Input() days: Day[] = [];
}
