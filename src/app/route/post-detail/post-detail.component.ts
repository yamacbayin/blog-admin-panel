import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryDto } from 'src/app/model/category';
import { CommentDto } from 'src/app/model/comment';
import { PostDto } from 'src/app/model/post';
import { UserDto } from 'src/app/model/user';
import { CategoryService } from 'src/app/service/category.service';
import { CommentService } from 'src/app/service/comment.service';
import { PostService } from 'src/app/service/post.service';
import { UserService } from 'src/app/service/user.service';

/**
 * Component for displaying and managing details of a post. 
 * Subscribes to all related services to stay updated.
 */
@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnDestroy {

  post: PostDto | undefined;
  author: UserDto | undefined;
  category: CategoryDto | undefined;
  commentList: CommentDto[] = [];

  private postListSubscription: Subscription;
  private postDeleteSubscription: Subscription;
  private userListSubscription: Subscription;
  private categoryListSubscription: Subscription;
  private commentListSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private categoryService: CategoryService,
    private postService: PostService,
    private commentService: CommentService
  ) {
    const params = this.route.snapshot.params;
    const postId = parseInt(params['id']);

    this.postListSubscription = postService.postListObservable$.subscribe(list => {
      this.post = postService.findPostById(postId);
      if (!this.post) {
        this.router.navigateByUrl('/posts');
      }
      this.author = userService.findUserById(this.post!.user_id);
      this.category = categoryService.findCategoryByCategoryId(this.post!.category_id);
      this.commentList = commentService.findAllCommentsByPostId(postId);
    });

    this.postDeleteSubscription = postService.backendDeleteResponse$.subscribe(response => {
      this.router.navigateByUrl('/posts');
    });

    this.userListSubscription = userService.userListObservable$.subscribe(list => {
      this.author = userService.findUserById(this.post!.user_id);
    });

    this.categoryListSubscription = categoryService.categoryListObservable$.subscribe(list => {
      this.category = categoryService.findCategoryByCategoryId(this.post!.category_id);
    });

    this.commentListSubscription = commentService.commentListObservable$.subscribe(list => {
      this.commentList = commentService.findAllCommentsByPostId(postId);
    })
  }

  onPutPost(post: PostDto) {
    this.postService.putPost(post);
  }

  onDeletePost(post: PostDto) {
    this.postService.deletePost(post);
  }

  onDeleteComment(comment: CommentDto) {
    this.commentService.deleteComment(comment);
  }

  /**
   * These two won't work but I implemented them anyway.
   */
  onDeleteUser(user: UserDto) {
    this.userService.deleteUser(user);
  }

  onDeleteCategory(category: CategoryDto) {
    this.categoryService.deleteCategory(category);
  }

  ngOnDestroy(): void {
    this.postListSubscription.unsubscribe();
    this.postDeleteSubscription.unsubscribe();
    this.userListSubscription.unsubscribe();
    this.categoryListSubscription.unsubscribe();
    this.commentListSubscription.unsubscribe();
  }

}
