import { Component } from '@angular/core';
import { UserService } from './service/user.service';
import { PostService } from './service/post.service';
import { CommentService } from './service/comment.service';
import { CategoryService } from './service/category.service';
import { MediatorService } from './service/mediator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Blog Admin Panel';

  // prevent services from getting destroyed??????
  constructor(
    private userService: UserService,
    private postService: PostService,
    private commentService: CommentService,
    private categoryService: CategoryService,
    private mediatorService: MediatorService
  ) {

  }
}
