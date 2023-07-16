import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterCategoryPipe } from './filter-category.pipe';
import { FilterPostPipe } from './filter-post.pipe';
import { FilterCommentPipe } from './filter-comment.pipe';
import { FilterUserPipe } from './filter-user.pipe';
import { ModelModule } from '../model/model.module';
import { SortUserPipe } from './sort-user.pipe';
import { SortCategoryPipe } from './sort-category.pipe';
import { SortPostPipe } from './sort-post.pipe';
import { SortCommentPipe } from './sort-comment.pipe';

@NgModule({
  declarations: [
    FilterCategoryPipe,
    FilterPostPipe,
    FilterCommentPipe,
    FilterUserPipe,
    SortUserPipe,
    SortCategoryPipe,
    SortPostPipe,
    SortCommentPipe
  ],
  imports: [
    CommonModule,
    ModelModule
  ],
  exports: [
    FilterUserPipe,
    FilterCategoryPipe,
    FilterPostPipe,
    FilterCommentPipe,
    SortUserPipe,
    SortCategoryPipe,
    SortPostPipe,
    SortCommentPipe
  ]
})
export class PipeModule { }
