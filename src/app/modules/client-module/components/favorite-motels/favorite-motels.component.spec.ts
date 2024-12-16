import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteMotelsComponent } from './favorite-motels.component';

describe('FavoriteMotelsComponent', () => {
  let component: FavoriteMotelsComponent;
  let fixture: ComponentFixture<FavoriteMotelsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FavoriteMotelsComponent]
    });
    fixture = TestBed.createComponent(FavoriteMotelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
