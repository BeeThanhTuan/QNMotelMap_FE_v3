import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupUpdateConvenientComponent } from './popup-update-convenient.component';

describe('PopupUpdateConvenientComponent', () => {
  let component: PopupUpdateConvenientComponent;
  let fixture: ComponentFixture<PopupUpdateConvenientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupUpdateConvenientComponent]
    });
    fixture = TestBed.createComponent(PopupUpdateConvenientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
