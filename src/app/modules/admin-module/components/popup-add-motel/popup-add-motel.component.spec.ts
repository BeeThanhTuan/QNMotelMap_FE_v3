import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupAddMotelComponent } from './popup-add-motel.component';

describe('PopupAddMotelComponent', () => {
  let component: PopupAddMotelComponent;
  let fixture: ComponentFixture<PopupAddMotelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupAddMotelComponent]
    });
    fixture = TestBed.createComponent(PopupAddMotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
