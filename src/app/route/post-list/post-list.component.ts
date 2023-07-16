import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/service/post.service';
import { Subscription } from 'rxjs';
import { PostDto, PostFilter } from 'src/app/model/post';
import { FilterPostPipe } from 'src/app/pipe/filter-post.pipe';
import { SortOption } from 'src/app/model/sort-option';

/**
 * Component for displaying and managing a list of posts.
 * 
 * @see {UserListComponent} for details.
 * 
 */
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
  providers: [FilterPostPipe]
})
export class PostListComponent implements OnInit, OnDestroy {

  sortOptions: SortOption[] = [
    { value: 'postId-asc', viewValue: 'Post ID Asc' },
    { value: 'postId-desc', viewValue: 'Post ID Desc' },
    { value: 'userId-asc', viewValue: 'User ID Asc' },
    { value: 'userId-desc', viewValue: 'User ID Desc' },
    { value: 'categoryId-asc', viewValue: 'Category ID Asc' },
    { value: 'categoryId-desc', viewValue: 'Category ID Desc' },
    { value: 'viewCount-asc', viewValue: 'View Count Asc' },
    { value: 'viewCount-desc', viewValue: 'View Count Desc' },
    { value: 'date-asc', viewValue: 'Date Asc' },
    { value: 'date-desc', viewValue: 'Date Desc' }
  ];
  selectedSort = this.sortOptions[0].value;

  filterPostId: string = '';
  filterUsername: string = '';
  filterUserId: string = '';
  filterTitle: string = '';
  filterCategoryName: string = '';
  filterCategoryId: string = '';

  private postListSubscription: Subscription;
  private backendDeleteSubscription: Subscription;
  private backendPutSubscription: Subscription;


  private postList: PostDto[] = [];
  filteredPostList: PostDto[] = [];

  postCount: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  totalPage: number = 1;
  listingRangeStart: number = 1;
  listingRangeEnd: number = 1;

  selectedPost: PostDto | undefined = undefined;

  constructor(
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute,
    private filterPipe: FilterPostPipe) {

    this.postListSubscription = this.postService.postListObservable$.subscribe(list => {
      this.postList = list;
      this.filterPosts();
      //In order to get DTO fields after a PUT request
      this.selectedPost = this.selectedPost === undefined ? undefined
        : postService.findPostById(this.selectedPost.post_id);
    });

    this.backendPutSubscription = this.postService.backendPostPutResponse$.subscribe(response => {
      if (response.post_id === this.selectedPost?.post_id) {
        this.selectedPost = response;
      }
    });

    this.backendDeleteSubscription = this.postService.backendDeleteResponse$.subscribe(response => {
      if (response.post_id === this.selectedPost?.post_id) {
        this.selectedPost = undefined;
      }
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filterPostId = params['post_id'] || '';
      this.filterUsername = params['username'] || '';
      this.filterUserId = params['user_id'] || '';
      this.filterTitle = params['title'] || '';
      this.filterCategoryName = params['category'] || '';
      this.filterCategoryId = params['category_id'] || '';
      this.filterPosts();
    });
  }

  filterPosts(): void {
    this.pageIndex = 0;
    const post_id: number | null = this.filterPostId === '' ? null : +this.filterPostId;
    const user_id: number | null = this.filterUserId === '' ? null : +this.filterUserId;
    const category_id: number | null = this.filterCategoryId === '' ? null : +this.filterCategoryId;
    const filters: PostFilter = {
      post_id: post_id,
      username: this.filterUsername,
      user_id: user_id,
      title: this.filterTitle,
      category_name: this.filterCategoryName,
      category_id: category_id
    };
    this.filteredPostList = this.filterPipe.transform(this.postList, filters);
    this.postCount = this.filteredPostList.length;
    this.calculateTotalPage();
  }

  onFiltersChange(): void {
    const queryParams: any = {};
    queryParams.post_id = this.filterPostId === '' ? null : this.filterPostId;
    queryParams.username = this.filterUsername === '' ? null : this.filterUsername;
    queryParams.user_id = this.filterUserId === '' ? null : this.filterUserId;
    queryParams.title = this.filterTitle === '' ? null : this.filterTitle;
    queryParams.category = this.filterCategoryName === '' ? null : this.filterCategoryName;
    queryParams.category_id = this.filterCategoryId === '' ? null : this.filterCategoryId;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }

  onEditPost(post: PostDto) {
    this.selectedPost = post;
  }

  onDeletePost(post: PostDto) {
    this.postService.deletePost(post);
  }

  onPutPost(post: PostDto) {
    this.postService.putPost(post);
  }

  private calculateTotalPage() {
    let totalPage = this.postCount / this.pageSize;
    const remainingItems = this.postCount % this.pageSize;
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
      this.listingRangeEnd = this.postCount;
    } else {
      this.listingRangeEnd = (this.pageIndex + 1) * this.pageSize;
    }

  }

  private scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnDestroy(): void {
    if (this.postListSubscription) {
      this.postListSubscription.unsubscribe();
    }
    if (this.backendDeleteSubscription) {
      this.backendDeleteSubscription.unsubscribe();
    }
    if (this.backendPutSubscription) {
      this.backendPutSubscription.unsubscribe();
    }
  }

}
