import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotelsComponent } from './motels.component';

describe('MotelsComponent', () => {
  let component: MotelsComponent;
  let fixture: ComponentFixture<MotelsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MotelsComponent]
    });
    fixture = TestBed.createComponent(MotelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
