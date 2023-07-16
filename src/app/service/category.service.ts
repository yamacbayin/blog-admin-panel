import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Subject, catchError, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category, CategoryDto, CategorySelect } from '../model/category';
import { MappingService } from './mapping.service';

/**
 * Service for managing category-related operations, 
 * such as retrieving category data, creating, updating, and deleting categories.
 * 
 * @see UserService for details.
 */
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private endpointUrl = "http://yamacbayin.com/categories";
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  private categoryList: CategoryDto[] = [];
  private categoryList$ = new BehaviorSubject<CategoryDto[]>(this.categoryList);
  public categoryListObservable$ = this.categoryList$.asObservable();

  private backendPostResponse = new Subject<CategoryDto>();
  public backendPostResponse$ = this.backendPostResponse.asObservable();

  private backendPutResponse = new Subject<CategoryDto>();
  public backendPutResponse$ = this.backendPutResponse.asObservable();

  private backendDeleteResponse = new Subject<CategoryDto>();
  public backendDeleteResponse$ = this.backendDeleteResponse.asObservable();

  constructor(
    private httpClient: HttpClient,
    private snackBar: MatSnackBar,
    private mappingService: MappingService
  ) {
    this.getCategories();
  }

  getCategories() {
    this.httpClient.get<CategoryDto[]>(this.endpointUrl)
      .pipe(
        catchError((error) => {
          this.showAlert(error.error.error);
          return of([] as CategoryDto[]);
        })
      )
      .subscribe(list => {
        this.categoryList = list;
        this.categoryList$.next(this.categoryList);
      });
  }

  public createCategory(categoryDto: CategoryDto) {

    let category = this.mappingService.categoryDtoToCategoryMapper(categoryDto);
    category = this.trimCategoryFields(category);

    if (this.validateCategoryFields(category)) {
      this.httpClient.post<Category>(this.endpointUrl, category, { headers: this.headers, observe: "response" })
        .subscribe({
          next: (response: any) => {
            if (response.status === 200) {
              const returnedCategory = this.mappingService.categoryToCategoryDtoMapper(response.body);
              this.categoryList.push(returnedCategory)
              this.categoryList$.next(this.categoryList);
              this.backendPostResponse.next(returnedCategory);
              this.showAlert("The category " + returnedCategory.name + " has been added successfully.")
            } else {
              this.showAlert("Unexpected status code: " + response.status + "\n" + response.body);
            }
          },
          error: (errorResponse) => {
            if (!errorResponse.error.error) {
              this.showAlert(errorResponse.error.detail + " - " + errorResponse.error.title);
            } else {
              this.showAlert(errorResponse.error.error);
            }
          }
        });
    }
  }

  public putCategory(categoryDto: CategoryDto) {

    let category = this.mappingService.categoryDtoToCategoryMapper(categoryDto);
    category = this.trimCategoryFields(category);

    if (this.validateCategoryFields(category)) {
      this.httpClient.put<Category>(this.endpointUrl, category, { headers: this.headers, observe: "response" })
        .subscribe({
          next: (response: any) => {
            if (response.status === 200) {
              const returnedCategory = this.mappingService.categoryToCategoryDtoMapper(response.body);
              returnedCategory.post_count = categoryDto.post_count;
              this.updateCategoryInCategoryList(returnedCategory);
              this.backendPutResponse.next(returnedCategory);
              this.showAlert("The category " + returnedCategory.name + " has been updated successfully.")
            } else {
              this.showAlert("Unexpected status code: " + response.status + "\n" + response.body);
            }
          },
          error: (errorResponse) => {
            if (!errorResponse.error.error) {
              this.showAlert(errorResponse.error.detail + " - " + errorResponse.error.title);
            } else {
              this.showAlert(errorResponse.error.error);
            }
          }
        });
    }
  }

  public deleteCategory(categoryDto: CategoryDto) {
    if (categoryDto.post_count > 0) {
      this.showAlert("Categories with posts cannot be deleted.");
    } else {
      const path = this.endpointUrl + "/id=" + categoryDto.category_id;
      this.httpClient.delete<Category>(path, { headers: this.headers, observe: "response" })
        .subscribe({
          next: (response: any) => {
            if (response.status === 200) {
              const deletedCategory = response.body;
              this.deleteCategoryInCategoryList(deletedCategory);
              this.categoryList$.next(this.categoryList);
              this.backendDeleteResponse.next(deletedCategory);
              this.showAlert(`The category "${deletedCategory.name}" has been deleted successfully.`)
            } else {
              this.showAlert("Unexpected status code: " + response.status + "\n" + response.body);
            }
          },
          error: (errorResponse) => {
            if (!errorResponse.error.error) {
              this.showAlert(errorResponse.error.detail + " - " + errorResponse.error.title);
            } else {
              this.showAlert(errorResponse.error.error);
            }
          }
        });
    }
  }

  private trimCategoryFields(category: Category): Category {
    const { name, ...rest } = category;
    const trimmedCategory = {
      name: name.trim(),
      ...rest
    }
    return trimmedCategory;
  }

  private validateCategoryFields(category: Category): boolean {
    if (category.name.length === 0 || category.name.length > 30) {
      this.showAlert("Category name must not be empty or exceed 30 characters.")
      return false;
    }
    return true;
  }

  private updateCategoryInCategoryList(updatedCategory: CategoryDto) {
    const index = this.categoryList.findIndex(categoryDto => categoryDto.category_id === updatedCategory.category_id);
    if (index !== -1) {
      this.categoryList[index] = updatedCategory;
      this.categoryList$.next(this.categoryList);
    } else {
      this.getCategories();
    }
  }

  private deleteCategoryInCategoryList(deletedCategory: CategoryDto) {
    const index = this.categoryList.findIndex(categoryDto => categoryDto.category_id === deletedCategory.category_id);

    if (index !== -1) {
      this.categoryList.splice(index, 1);
      this.categoryList$.next(this.categoryList);
    } else {
      this.getCategories();
    }
  }

  public getAllCategoryIdsAndNames(): CategorySelect[] {
    const selectCategoryOptions: CategorySelect[] = this.categoryList.map(category =>
      this.mappingService.categoryDtoToCategorySelectMapper(category));
    return selectCategoryOptions;
  }

  public findCategoryByCategoryId(id: number): CategoryDto | undefined {
    const index = this.categoryList.findIndex(categoryDto => categoryDto.category_id === id);
    if (index !== -1) {
      return this.categoryList[index];
    } else {
      return undefined;
    }
  }

  showAlert(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 10000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

}
