import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryDto } from 'src/app/model/category';
import { PostDto } from 'src/app/model/post';
import { CategoryService } from 'src/app/service/category.service';
import { PostService } from 'src/app/service/post.service';

/**
 * Component for displaying and managing details of a category. 
 * Subscribes to all related services to stay updated.
 */
@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css']
})
export class CategoryDetailComponent implements OnDestroy {

  category: CategoryDto | undefined;
  postList: PostDto[] = [];

  private categoryListSubscription: Subscription;
  private categoryDeleteSubscription: Subscription;
  private postListSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private postService: PostService
  ) {
    const params = this.route.snapshot.params;
    const categoryId = parseInt(params['id']);

    this.categoryListSubscription = categoryService.categoryListObservable$.subscribe(list => {
      this.category = categoryService.findCategoryByCategoryId(categoryId);
      this.category = this.categoryService.findCategoryByCategoryId(categoryId);
      if (!this.category) {
        this.router.navigateByUrl('/categories');
      }
    });

    this.categoryDeleteSubscription = categoryService.backendDeleteResponse$.subscribe(response => {
      this.router.navigateByUrl('/categories');
    });

    this.postListSubscription = postService.postListObservable$.subscribe(list => {
      this.postList = postService.findAllPostsByCategoryId(categoryId);
    })
  }

  onPutCategory(category: CategoryDto) {
    this.categoryService.putCategory(category);
  }

  onDeleteCategory(category: CategoryDto) {
    this.categoryService.deleteCategory(category);
  }

  onDeletePost(post: PostDto) {
    this.postService.deletePost(post);
  }

  ngOnDestroy(): void {
    this.categoryListSubscription.unsubscribe();
    this.categoryDeleteSubscription.unsubscribe();
    this.postListSubscription.unsubscribe();
  }
}
