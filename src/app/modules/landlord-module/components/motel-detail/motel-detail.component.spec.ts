import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotelDetailComponent } from './motel-detail.component';

describe('MotelDetailComponent', () => {
  let component: MotelDetailComponent;
  let fixture: ComponentFixture<MotelDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MotelDetailComponent]
    });
    fixture = TestBed.createComponent(MotelDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
