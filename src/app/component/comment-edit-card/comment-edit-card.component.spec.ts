import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentEditCardComponent } from './comment-edit-card.component';

describe('CommentEditCardComponent', () => {
  let component: CommentEditCardComponent;
  let fixture: ComponentFixture<CommentEditCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommentEditCardComponent]
    });
    fixture = TestBed.createComponent(CommentEditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
