import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEditCardComponent } from './post-edit-card.component';

describe('PostEditCardComponent', () => {
  let component: PostEditCardComponent;
  let fixture: ComponentFixture<PostEditCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostEditCardComponent]
    });
    fixture = TestBed.createComponent(PostEditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
