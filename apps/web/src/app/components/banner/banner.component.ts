import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  @Input() message: string = '';
  @Input() type: 'info' | 'success' | 'warning' | 'error' = 'info';
  @Input() dismissable: boolean = true;

  bannerClass: string = '';

  ngOnInit(): void {
    this.bannerClass = this.getBannerClass();
  }

  getBannerClass(): string {
    return `banner-${this.type}`;
  }

  dismissBanner(): void {
    // You can implement a dismiss action here, or emit an event to parent component
  }
}
