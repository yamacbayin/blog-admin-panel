import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommentDto } from 'src/app/model/comment';
import { PostDto } from 'src/app/model/post';
import { UserDto } from 'src/app/model/user';
import { CommentService } from 'src/app/service/comment.service';
import { PostService } from 'src/app/service/post.service';
import { UserService } from 'src/app/service/user.service';

/**
 * Component for displaying and managing details of a comment. 
 * Subscribes to all related services to stay updated.
 */
@Component({
  selector: 'app-comment-detail',
  templateUrl: './comment-detail.component.html',
  styleUrls: ['./comment-detail.component.css']
})
export class CommentDetailComponent implements OnDestroy {

  comment: CommentDto | undefined;
  author: UserDto | undefined;
  post: PostDto | undefined;

  private commentListSubscription: Subscription;
  private commentDeleteSubscription: Subscription;
  private userListSubscription: Subscription;
  private postListSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private postService: PostService,
    private commentService: CommentService
  ) {
    const params = this.route.snapshot.params;
    const commentId = parseInt(params['id']);
    this.comment = this.commentService.findCommentById(commentId);

    this.commentListSubscription = commentService.commentListObservable$.subscribe(list => {
      this.comment = commentService.findCommentById(commentId);
      if (!this.comment) {
        this.router.navigateByUrl('/comments');
      }
      this.author = userService.findUserById(this.comment!.user_id);
      this.post = postService.findPostById(this.comment!.post_id);
    });

    this.commentDeleteSubscription = commentService.backendDeleteResponse$.subscribe(response => {
      this.router.navigateByUrl('/comments');
    });

    this.userListSubscription = userService.userListObservable$.subscribe(list => {
      this.author = userService.findUserById(this.comment!.user_id);
    });

    this.postListSubscription = postService.postListObservable$.subscribe(list => {
      this.post = postService.findPostById(this.comment!.post_id);
    });
  }

  onPutComment(comment: CommentDto) {
    this.commentService.putComment(comment);
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

  onDeletePost(post: PostDto) {
    this.postService.deletePost(post);
  }

  ngOnDestroy() {
    this.commentListSubscription.unsubscribe();
    this.commentDeleteSubscription.unsubscribe();
    this.userListSubscription.unsubscribe();
    this.postListSubscription.unsubscribe();
  }

}
