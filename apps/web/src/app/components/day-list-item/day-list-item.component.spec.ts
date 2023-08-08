import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayListItemComponent } from './day-list-item.component';

describe('DayListItemComponent', () => {
  let component: DayListItemComponent;
  let fixture: ComponentFixture<DayListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayListItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
