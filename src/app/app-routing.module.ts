import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './route/post-list/post-list.component';
import { PostDetailComponent } from './route/post-detail/post-detail.component';
import { PostCreateComponent } from './route/post-create/post-create.component';
import { CategoryListComponent } from './route/category-list/category-list.component';
import { CategoryDetailComponent } from './route/category-detail/category-detail.component';
import { CategoryCreateComponent } from './route/category-create/category-create.component';
import { CommentListComponent } from './route/comment-list/comment-list.component';
import { CommentDetailComponent } from './route/comment-detail/comment-detail.component';
import { CommentCreateComponent } from './route/comment-create/comment-create.component';
import { UserDetailComponent } from './route/user-detail/user-detail.component';
import { UserCreateComponent } from './route/user-create/user-create.component';
import { UserListComponent } from './route/user-list/user-list.component';
import { NotFoundComponent } from './route/not-found/not-found.component';

const routes: Routes = [
  {path: '', redirectTo: 'users', pathMatch: 'full'},
  {path: 'users', component: UserListComponent},
  {path: 'users/create', component: UserCreateComponent},
  {path: 'users/:id', component: UserDetailComponent,},
  {path: 'categories', component: CategoryListComponent},
  {path: 'categories/create', component: CategoryCreateComponent},
  {path: 'categories/:id', component: CategoryDetailComponent},
  {path: 'posts', component: PostListComponent},
  {path: 'posts/create', component: PostCreateComponent},
  {path: 'posts/:id', component: PostDetailComponent},
  {path: 'comments', component: CommentListComponent},
  {path: 'comments/create', component: CommentCreateComponent},
  {path: 'comments/:id', component: CommentDetailComponent},
  {path: '**', component: NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
