import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryDto } from 'src/app/model/category';
import { CategoryService } from 'src/app/service/category.service';

/**
 * Component for creating a new category.
 */
@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.css']
})
export class CategoryCreateComponent implements OnDestroy {

  private createCategorySubscription: Subscription;

  constructor(
    private router: Router,
    private categoryService: CategoryService) {

    /**
     * Subscription to handle the response of the create category request.
     * If response is 200, redirects to the detail of newly created category.
     */
    this.createCategorySubscription = this.categoryService.backendPostResponse$.subscribe(
      {
        next: (response: CategoryDto) => {
          this.router.navigateByUrl('/categories/' + response.category_id);
        }
      }
    );
  }

  onCreateCategory(categoryDto: CategoryDto) {
    this.categoryService.createCategory(categoryDto);
  }

  ngOnDestroy() {
    if (this.createCategorySubscription) {
      this.createCategorySubscription.unsubscribe();
    }
  }

}
