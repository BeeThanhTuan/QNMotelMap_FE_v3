import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupAddRoomTypeComponent } from './popup-add-room-type.component';

describe('PopupAddRoomTypeComponent', () => {
  let component: PopupAddRoomTypeComponent;
  let fixture: ComponentFixture<PopupAddRoomTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupAddRoomTypeComponent]
    });
    fixture = TestBed.createComponent(PopupAddRoomTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
