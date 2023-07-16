import { Component, OnDestroy, OnInit } from '@angular/core';
import { FilterCommentPipe } from 'src/app/pipe/filter-comment.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommentService } from 'src/app/service/comment.service';
import { CommentDto, CommentFilter } from 'src/app/model/comment';
import { SortOption } from 'src/app/model/sort-option';

/**
 * Component for displaying and managing a list of comments.
 * 
 * @see {UserListComponent} for details.
 * 
 */
@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css'],
  providers: [FilterCommentPipe]
})
export class CommentListComponent implements OnInit, OnDestroy {

  sortOptions: SortOption[] = [
    { value: 'commentId-asc', viewValue: 'Comment ID Asc' },
    { value: 'commentId-desc', viewValue: 'Comment ID Desc' },
    { value: 'postId-asc', viewValue: 'Post ID Asc' },
    { value: 'postId-desc', viewValue: 'Post ID Desc' },
    { value: 'userId-asc', viewValue: 'User ID Asc' },
    { value: 'userId-desc', viewValue: 'User ID Desc' },
    { value: 'date-asc', viewValue: 'Date Asc' },
    { value: 'date-desc', viewValue: 'Date Desc' }
  ];
  selectedSort = this.sortOptions[0].value;

  filterCommentId: string = '';
  filterPostId: string = '';
  filterUserId: string = '';
  filterUsername: string = '';
  filterPostTitle: string = '';
  filterComment: string = '';

  private commentListSubscription: Subscription;
  private backendDeleteSubscription: Subscription;
  private backendPutSubscription: Subscription;

  private commentList: CommentDto[] = [];
  filteredCommentList: CommentDto[] = [];

  commentCount: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  totalPage: number = 1;
  listingRangeStart: number = 1;
  listingRangeEnd: number = 1;

  selectedComment: CommentDto | undefined = undefined;

  constructor(
    private commentService: CommentService,
    private router: Router,
    private route: ActivatedRoute,
    private filterPipe: FilterCommentPipe) {

    this.commentListSubscription = this.commentService.commentListObservable$.subscribe(list => {
      this.commentList = list;
      this.filterComments();
      //In order to get DTO fields after a PUT request
      this.selectedComment = this.selectedComment === undefined ? undefined
        : commentService.findCommentById(this.selectedComment.comment_id);
    });

    this.backendPutSubscription = this.commentService.backendPostPutResponse$.subscribe(response => {
      if (response.comment_id === this.selectedComment?.comment_id) {
        this.selectedComment = response;
      }
    });

    this.backendDeleteSubscription = this.commentService.backendDeleteResponse$.subscribe(response => {
      if (response.comment_id === this.selectedComment?.comment_id) {
        this.selectedComment = undefined;
      }
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filterCommentId = params['comment_id'] || '';
      this.filterPostId = params['post_id'] || '';
      this.filterUserId = params['user_id'] || '';
      this.filterUsername = params['username'] || '';
      this.filterPostTitle = params['post_title'] || '';
      this.filterComment = params['comment'] || '';
      this.filterComments();
    });
  }

  filterComments(): void {
    this.pageIndex = 0;
    const comment_id: number | null = this.filterCommentId === '' ? null : +this.filterCommentId;
    const post_id: number | null = this.filterPostId === '' ? null : +this.filterPostId;
    const user_id: number | null = this.filterUserId === '' ? null : +this.filterUserId;
    const filters: CommentFilter = {
      comment_id: comment_id,
      post_id: post_id,
      user_id: user_id,
      username: this.filterUsername,
      post_title: this.filterPostTitle,
      comment: this.filterComment
    };
    this.filteredCommentList = this.filterPipe.transform(this.commentList, filters);
    this.commentCount = this.filteredCommentList.length;
    this.calculateTotalPage();
  }

  onFiltersChange(): void {
    const queryParams: any = {};
    queryParams.comment_id = this.filterCommentId === '' ? null : this.filterCommentId;
    queryParams.post_id = this.filterPostId === '' ? null : this.filterPostId;
    queryParams.user_id = this.filterUserId === '' ? null : this.filterUserId;
    queryParams.username = this.filterUsername === '' ? null : this.filterUsername;
    queryParams.post_title = this.filterPostTitle === '' ? null : this.filterPostTitle;
    queryParams.comment = this.filterComment === '' ? null : this.filterComment;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }

  onEditComment(comment: CommentDto) {
    this.selectedComment = comment;
  }

  onDeleteComment(comment: CommentDto) {
    this.commentService.deleteComment(comment);
  }

  onPutComment(comment: CommentDto) {
    this.commentService.putComment(comment);
  }

  private calculateTotalPage() {
    let totalPage = this.commentCount / this.pageSize;
    const remainingItems = this.commentCount % this.pageSize;
    if (remainingItems > 0) {
      totalPage++;
    }
    this.totalPage = Math.trunc(totalPage);
    this.updateListingRange()
  }

  onPreviousPageClick() {
    if (this.pageIndex > 0) {
      this.pageIndex = this.pageIndex - 1;
      this.updateListingRange()
      this.scrollToTop();
    }
  }

  onNextPageClick() {
    if (this.pageIndex < this.totalPage - 1) {
      this.pageIndex = this.pageIndex + 1;
      this.updateListingRange()
      this.scrollToTop();
    }
  }

  private updateListingRange() {
    this.listingRangeStart = 1 + (((this.pageIndex + 1) * this.pageSize) - this.pageSize);
    if (this.pageIndex === this.totalPage - 1) {
      this.listingRangeEnd = this.commentCount;
    } else {
      this.listingRangeEnd = (this.pageIndex + 1) * this.pageSize;
    }
  }

  private scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnDestroy(): void {
    if (this.commentListSubscription) {
      this.commentListSubscription.unsubscribe();
    }
    if (this.backendDeleteSubscription) {
      this.backendDeleteSubscription.unsubscribe();
    }
    if (this.backendPutSubscription) {
      this.backendPutSubscription.unsubscribe();
    }
  }
}
