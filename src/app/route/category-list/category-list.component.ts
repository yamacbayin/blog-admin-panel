import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/service/category.service';
import { Subscription } from 'rxjs';
import { CategoryDto } from 'src/app/model/category';
import { FilterCategoryPipe } from 'src/app/pipe/filter-category.pipe';
import { SortOption } from 'src/app/model/sort-option';

/**
 * Component for displaying and managing a list of categories.
 * 
 * @see {UserListComponent} for details.
 * 
 */
@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  providers: [FilterCategoryPipe]
})
export class CategoryListComponent implements OnInit, OnDestroy {

  sortOptions: SortOption[] = [
    { value: 'categoryId-asc', viewValue: 'Category ID Asc' },
    { value: 'categoryId-desc', viewValue: 'Category ID Desc' },
    { value: 'categoryName-asc', viewValue: 'Name Asc' },
    { value: 'categoryName-desc', viewValue: 'Name Desc' },
    { value: 'date-asc', viewValue: 'Date Asc' },
    { value: 'date-desc', viewValue: 'Date Desc' }
  ];
  selectedSort = this.sortOptions[0].value;

  filterCategoryId: string = '';
  filterName: string = '';

  private categoryListSubscription: Subscription;
  private backendDeleteSubscription: Subscription;
  private backendPutSubscription: Subscription;

  private categoryList: CategoryDto[] = [];
  filteredCategoryList: CategoryDto[] = [];

  categoryCount: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  totalPage: number = 1;
  listingRangeStart: number = 1;
  listingRangeEnd: number = 1;

  selectedCategory: CategoryDto | undefined = undefined;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private filterPipe: FilterCategoryPipe) {

    this.categoryListSubscription = this.categoryService.categoryListObservable$.subscribe(list => {
      this.categoryList = list;
      this.filterCategories();
    });

    this.backendPutSubscription = this.categoryService.backendPutResponse$.subscribe(response => {
      if (response.category_id === this.selectedCategory?.category_id) {
        this.selectedCategory = response;
      }
    });

    this.backendDeleteSubscription = this.categoryService.backendDeleteResponse$.subscribe(response => {
      if (response.category_id === this.selectedCategory?.category_id) {
        this.selectedCategory = undefined;
      }
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filterName = params['name'] || '';
      this.filterCategoryId = params['category_id'] || '';
      this.filterCategories();
    });
  }

  filterCategories(): void {
    this.pageIndex = 0;
    const id: number | null = this.filterCategoryId === '' ? null : +this.filterCategoryId;
    this.filteredCategoryList = this.filterPipe.transform(this.categoryList, this.filterName, id);
    this.categoryCount = this.filteredCategoryList.length;
    this.calculateTotalPage();
  }

  onFiltersChange(): void {
    const queryParams: any = {};
    queryParams.name = this.filterName !== '' ? this.filterName : null;
    queryParams.category_id = this.filterCategoryId !== '' ? this.filterCategoryId : null;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }

  onEditCategory(category: CategoryDto) {
    this.selectedCategory = category;
  }

  onDeleteCategory(category: CategoryDto) {
    this.categoryService.deleteCategory(category);
  }

  onPutCategory(category: CategoryDto) {
    this.categoryService.putCategory(category);
  }

  private calculateTotalPage() {
    let totalPage = this.categoryCount / this.pageSize;
    const remainingItems = this.categoryCount % this.pageSize;
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
      this.listingRangeEnd = this.categoryCount;
    } else {
      this.listingRangeEnd = (this.pageIndex + 1) * this.pageSize;
    }

  }

  private scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnDestroy(): void {
    if (this.categoryListSubscription) {
      this.categoryListSubscription.unsubscribe();
    }
    if (this.backendDeleteSubscription) {
      this.backendDeleteSubscription.unsubscribe();
    }
    if (this.backendPutSubscription) {
      this.backendPutSubscription.unsubscribe();
    }
  }


}
