import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupUpdateRoomTypeComponent } from './popup-update-room-type.component';

describe('PopupUpdateRoomTypeComponent', () => {
  let component: PopupUpdateRoomTypeComponent;
  let fixture: ComponentFixture<PopupUpdateRoomTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupUpdateRoomTypeComponent]
    });
    fixture = TestBed.createComponent(PopupUpdateRoomTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
