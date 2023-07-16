import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDto } from 'src/app/model/user';
import { PostDto } from 'src/app/model/post';
import { CommentDto } from 'src/app/model/comment';
import { UserService } from 'src/app/service/user.service';
import { PostService } from 'src/app/service/post.service';
import { CommentService } from 'src/app/service/comment.service';
import { Subscription } from 'rxjs';

/**
 * Component for displaying and managing details of a user. 
 * Subscribes to all related services to stay updated.
 */
@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnDestroy {

  user?: UserDto | undefined;
  postList: PostDto[] = [];
  commentList: CommentDto[] = [];

  private userListSubscription: Subscription;
  private userDeleteSubscription: Subscription;
  private postListSubscription: Subscription;
  private commentListSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private postService: PostService,
    private commentService: CommentService,
  ) {
    const params = this.route.snapshot.params;
    const userId = parseInt(params['id']);

    this.userListSubscription = this.userService.userListObservable$.subscribe(list => {
      this.user = this.userService.findUserById(userId);
      if (!this.user) {
        this.router.navigateByUrl('/users');
      }
    })

    this.userDeleteSubscription = this.userService.backendDeleteResponse$.subscribe(response => {
      this.router.navigateByUrl('/users');
    })

    this.postListSubscription = this.postService.postListObservable$.subscribe(list => {
      this.postList = this.postService.findAllPostsByUserId(userId);
    })

    this.commentListSubscription = this.commentService.commentListObservable$.subscribe(list => {
      this.commentList = commentService.findAllCommentsByUserId(userId);
    })
  }

  onPutUser(user: UserDto) {
    this.userService.putUser(user);
  }

  onDeleteUser(user: UserDto) {
    this.userService.deleteUser(user);
  }

  onDeletePost(post: PostDto) {
    this.postService.deletePost(post);
  }

  onDeleteComment(comment: CommentDto) {
    this.commentService.deleteComment(comment);
  }

  ngOnDestroy(): void {
    this.userListSubscription.unsubscribe();
    this.userDeleteSubscription.unsubscribe();
    this.postListSubscription.unsubscribe();
    this.commentListSubscription.unsubscribe();
  }

}
