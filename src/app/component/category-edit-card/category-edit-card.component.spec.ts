import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryEditCardComponent } from './category-edit-card.component';

describe('CategoryEditCardComponent', () => {
  let component: CategoryEditCardComponent;
  let fixture: ComponentFixture<CategoryEditCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryEditCardComponent]
    });
    fixture = TestBed.createComponent(CategoryEditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
