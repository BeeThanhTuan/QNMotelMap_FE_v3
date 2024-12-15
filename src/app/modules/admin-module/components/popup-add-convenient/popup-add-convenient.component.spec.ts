import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupAddConvenientComponent } from './popup-add-convenient.component';

describe('PopupAddConvenientComponent', () => {
  let component: PopupAddConvenientComponent;
  let fixture: ComponentFixture<PopupAddConvenientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupAddConvenientComponent]
    });
    fixture = TestBed.createComponent(PopupAddConvenientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
