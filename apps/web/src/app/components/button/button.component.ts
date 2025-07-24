import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-button",
  templateUrl: "./button.component.html",
  styleUrls: ["./button.component.scss"]
})
export class ButtonComponent {
  @Input() text = "";
  @Input() disabled = false;
  @Input() size: "xs" | "sm" | "md" | "lg" | "xl" = "md";
  @Input() color: "primary" | "accent" = "primary";
  @Input() fill: "fill" | "outline" = "fill";
  @Input() type: "button" | "submit" = "button";
  @Input() widthPercent?: number;

  @Output() clicked = new EventEmitter<void>();
}
