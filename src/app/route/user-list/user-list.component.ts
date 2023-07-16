import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { Subscription } from 'rxjs';
import { UserDto } from 'src/app/model/user';
import { FilterUserPipe } from 'src/app/pipe/filter-user.pipe';
import { SortOption } from 'src/app/model/sort-option';

/**
 * Component for displaying and managing a list of users.
 * 
 * Provides sorting and filtering options for the user list.
 * Allows editing and deleting user entries.
 * Provides quick editing with the right side sticky edit card.
 * Supports pagination for navigating through the user list.
 *
 * @implements {OnInit} Angular lifecycle hook for component initialization.
 * @implements {OnDestroy} Angular lifecycle hook for component cleanup.
 */
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  providers: [FilterUserPipe]
})
export class UserListComponent implements OnInit, OnDestroy {

  /**
   * Array of sort options available for the user list.
   */
  sortOptions: SortOption[] = [
    { value: 'id-asc', viewValue: 'User ID Asc' },
    { value: 'id-desc', viewValue: 'User ID Desc' },
    { value: 'cd-asc', viewValue: 'Date Asc' },
    { value: 'cd-desc', viewValue: 'Date Desc' },
    { value: 'postc-asc', viewValue: 'Post Count Asc' },
    { value: 'postc-desc', viewValue: 'Post Count Desc' },
    { value: 'commentc-asc', viewValue: 'Comment Count Asc' },
    { value: 'commentc-desc', viewValue: 'Comment Count Desc' },
  ]
  selectedSort: string = this.sortOptions[0].value;

  filterUserId: string = '';
  filterUsername: string = '';

  private userListSubscription: Subscription;
  private backendDeleteSubscription: Subscription;
  private backendPutSubscription: Subscription;

  private userList: UserDto[] = [];
  filteredUserList: UserDto[] = [];

  userCount: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  totalPage: number = 1;
  listingRangeStart: number = 1;
  listingRangeEnd: number = 1;

  selectedUser: UserDto | undefined = undefined;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private filterPipe: FilterUserPipe) {

    this.userListSubscription = this.userService.userListObservable$.subscribe(list => {
      this.userList = list;
      this.filterUsers();
    });

    this.backendPutSubscription = this.userService.backendPutResponse$.subscribe(response => {
      if (response.user_id === this.selectedUser?.user_id) {
        this.selectedUser = response;
      }
    });

    this.backendDeleteSubscription = this.userService.backendDeleteResponse$.subscribe(response => {
      if (response.user_id === this.selectedUser?.user_id) {
        this.selectedUser = undefined;
      }
    });
  }

  /**
   * Initializes the component.
   * Retrieves and applies query parameters for filtering.
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filterUsername = params['username'] || '';
      this.filterUserId = params['user_id'] || '';
      this.filterUsers();
    });
  }

  /**
   * Filters the user list based on the filter inputs.
   */
  filterUsers(): void {
    this.pageIndex = 0;
    const id: number | null = this.filterUserId === '' ? null : +this.filterUserId;
    this.filteredUserList = this.filterPipe.transform(this.userList, id, this.filterUsername);
    this.userCount = this.filteredUserList.length;
    this.calculateTotalPage();
  }

  /**
   * Handles the change of filter inputs.
   * Updates query parameters and triggers the filtering process.
   */
  onFiltersChange(): void {
    const queryParams: any = {};
    queryParams.username = this.filterUsername !== '' ? this.filterUsername : null;
    queryParams.user_id = this.filterUserId !== '' ? this.filterUserId : null;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }

  /**
   * 
   * Sets the selected user for editing.
   * Updates the content of the right-side edit card with the details of the selected user.
   *
   * @param {UserDto} user The user to be edited.
   */
  onEditUser(user: UserDto) {
    this.selectedUser = user;
  }

  onDeleteUser(user: UserDto) {
    this.userService.deleteUser(user);
  }

  onPutUser(user: UserDto) {
    this.userService.putUser(user);
  }

  /**
   * Calculates the total number of pages based on the user count and page size.
   * Updates the listing range accordingly.
   */
  private calculateTotalPage() {
    let totalPage = this.userCount / this.pageSize;
    const remainingItems = this.userCount % this.pageSize;
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

  /**
    * Updates the listing range based on the current page index.
    * This method calculates the starting and ending indexes of the displayed users on the current page.
    * It is used to determine the range of users being shown in the user list.
    */
  private updateListingRange() {
    this.listingRangeStart = 1 + (((this.pageIndex + 1) * this.pageSize) - this.pageSize);
    if (this.pageIndex === this.totalPage - 1) {
      this.listingRangeEnd = this.userCount;
    } else {
      this.listingRangeEnd = (this.pageIndex + 1) * this.pageSize;
    }
  }

  private scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnDestroy(): void {
    if (this.userListSubscription) {
      this.userListSubscription.unsubscribe();
    }
    if (this.backendDeleteSubscription) {
      this.backendDeleteSubscription.unsubscribe();
    }
    if (this.backendPutSubscription) {
      this.backendPutSubscription.unsubscribe();
    }
  }

}
