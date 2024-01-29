import { Component, Input } from "@angular/core";
import { Day } from "src/app/interfaces";

@Component({
  selector: "app-day-list",
  templateUrl: "./day-list.component.html",
  styleUrls: ["./day-list.component.css"]
})
export class DayListComponent {
  @Input() days: Day[] = [];
}
