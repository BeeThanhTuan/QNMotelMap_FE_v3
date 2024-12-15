import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvenientComponent } from './convenient.component';

describe('ConvenientComponent', () => {
  let component: ConvenientComponent;
  let fixture: ComponentFixture<ConvenientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConvenientComponent]
    });
    fixture = TestBed.createComponent(ConvenientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
