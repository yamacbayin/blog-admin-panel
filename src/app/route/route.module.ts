import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { PostService } from '../service/post.service';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { ComponentModule } from '../component/component.module';
import { MatDialogModule } from '@angular/material/dialog';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { CommentDetailComponent } from './comment-detail/comment-detail.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryCreateComponent } from './category-create/category-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { CommentCreateComponent } from './comment-create/comment-create.component';
import { UserService } from '../service/user.service';
import { CategoryService } from '../service/category.service';
import { CommentService } from '../service/comment.service';
import { ModelModule } from '../model/model.module';
import { PipeModule } from "../pipe/pipe.module";
import { NotFoundComponent } from './not-found/not-found.component';



@NgModule({
    declarations: [
        CategoryDetailComponent,
        PostDetailComponent,
        CommentDetailComponent,
        UserListComponent,
        UserCreateComponent,
        UserDetailComponent,
        CategoryListComponent,
        CategoryCreateComponent,
        PostListComponent,
        PostCreateComponent,
        CommentListComponent,
        CommentCreateComponent,
        NotFoundComponent
    ],
    providers: [
        UserService,
        CategoryService,
        PostService,
        CommentService
    ],
    exports: [],
    imports: [
        CommonModule,
        MatCardModule,
        ComponentModule,
        MatButtonModule,
        FormsModule,
        MatSelectModule,
        ModelModule,
        MatInputModule,
        RouterModule,
        MatDialogModule,
        PipeModule
    ]
})
export class RouteModule {

}
