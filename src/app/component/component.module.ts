import { NgModule } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ServiceModule } from '../service/service.module';
import { ModelModule } from '../model/model.module';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NavbarComponent } from './navbar/navbar.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';

import { UserCardComponent } from './user-card/user-card.component';
import { UserEditCardComponent } from './user-edit-card/user-edit-card.component';
import { CategoryCardComponent } from './category-card/category-card.component';
import { CategoryEditCardComponent } from './category-edit-card/category-edit-card.component';
import { PostCardComponent } from './post-card/post-card.component';
import { PostEditCardComponent } from './post-edit-card/post-edit-card.component';
import { CommentCardComponent } from './comment-card/comment-card.component';
import { CommentEditCardComponent } from './comment-edit-card/comment-edit-card.component';



@NgModule({
  declarations: [
    CategoryCardComponent,
    CommentCardComponent,
    UserCardComponent,
    UserEditCardComponent,
    PostCardComponent,
    PostEditCardComponent,
    CategoryEditCardComponent,
    CommentEditCardComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    BrowserAnimationsModule,
    ModelModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatIconModule
  ],
  exports: [
    NavbarComponent,
    UserCardComponent,
    UserEditCardComponent,
    CategoryCardComponent,
    CategoryEditCardComponent,
    PostCardComponent,
    PostEditCardComponent,
    CommentCardComponent,
    CommentEditCardComponent
  ]
})
export class ComponentModule { }
