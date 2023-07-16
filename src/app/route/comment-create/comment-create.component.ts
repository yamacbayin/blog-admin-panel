import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommentDto } from 'src/app/model/comment';
import { CommentService } from 'src/app/service/comment.service';

/**
 * Component for creating a new comment.
 */
@Component({
  selector: 'app-comment-create',
  templateUrl: './comment-create.component.html',
  styleUrls: ['./comment-create.component.css']
})
export class CommentCreateComponent implements OnDestroy {

  private createCommentSubscription: Subscription;

  constructor(
    private router: Router,
    private commentService: CommentService) {


    /**
     * Subscription to handle the response of the create comment request.
     * If response is 200, redirects to the detail of newly created comment.
     */
    this.createCommentSubscription = this.commentService.backendPostPutResponse$.subscribe(
      {
        next: (response: CommentDto) => {
          this.router.navigateByUrl('/comments/' + response.comment_id);
        }
      }
    );
  }

  onCreateComment(commentDto: CommentDto) {
    this.commentService.createComment(commentDto);
  }

  ngOnDestroy() {
    if (this.createCommentSubscription) {
      this.createCommentSubscription.unsubscribe();
    }
  }
}
