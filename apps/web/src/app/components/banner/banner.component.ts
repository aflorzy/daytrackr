import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
})
export class BannerComponent implements OnInit {
  @Input() message: string = '';
  @Input() type: 'info' | 'success' | 'warning' | 'error' = 'info';
  @Input() dismissable: boolean = true;
  @Output() dismissed = new EventEmitter<void>();

  bannerClass: string = '';

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
