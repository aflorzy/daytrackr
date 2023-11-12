import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Input() text = '';
  @Input() disabled = false;
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() color: 'primary' | 'accent' = 'primary';
  @Input() fill: 'fill' | 'outline' = 'fill';

  @Output() click = new EventEmitter<void>();
}
