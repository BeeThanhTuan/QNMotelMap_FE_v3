import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMotelOnMapComponent } from './view-motel-on-map.component';

describe('ViewMotelOnMapComponent', () => {
  let component: ViewMotelOnMapComponent;
  let fixture: ComponentFixture<ViewMotelOnMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewMotelOnMapComponent]
    });
    fixture = TestBed.createComponent(ViewMotelOnMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
