import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomTypesComponent } from './room-types.component';

describe('RoomsComponent', () => {
  let component: RoomTypesComponent;
  let fixture: ComponentFixture<RoomTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomTypesComponent]
    });
    fixture = TestBed.createComponent(RoomTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
