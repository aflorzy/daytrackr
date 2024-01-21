import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { StatusType } from "../../enums";

@Component({
  selector: "app-banner",
  templateUrl: "./banner.component.html",
  styleUrls: ["./banner.component.css"]
})
export class BannerComponent implements OnInit {
  @Input() message = "";
  @Input() type: StatusType = StatusType.INFO;
  @Input() dismissable = true;
  @Output() dismissed = new EventEmitter<void>();

  bannerClass = "";

  ngOnInit(): void {
    this.bannerClass = this.getBannerClass();
  }

  getBannerClass(): string {
    return `banner-${this.type}`;
  }

  dismissBanner(): void {
    this.dismissed.emit();
  }
}
