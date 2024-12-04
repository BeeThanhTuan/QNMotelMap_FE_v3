import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupUpdateMotelComponent } from './popup-update-motel.component';

describe('PopupUpdateMotelComponent', () => {
  let component: PopupUpdateMotelComponent;
  let fixture: ComponentFixture<PopupUpdateMotelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupUpdateMotelComponent]
    });
    fixture = TestBed.createComponent(PopupUpdateMotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
