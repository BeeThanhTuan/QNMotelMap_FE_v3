import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProfileLandlordComponent } from './update-profile-landlord.component';

describe('UpdateProfileLandlordComponent', () => {
  let component: UpdateProfileLandlordComponent;
  let fixture: ComponentFixture<UpdateProfileLandlordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateProfileLandlordComponent]
    });
    fixture = TestBed.createComponent(UpdateProfileLandlordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
