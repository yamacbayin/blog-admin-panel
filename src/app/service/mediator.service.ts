import { Injectable, OnDestroy } from '@angular/core';
import { UserService } from './user.service';
import { CategoryService } from './category.service';
import { PostService } from './post.service';
import { CommentService } from './comment.service';
import { UserSelect } from '../model/user';
import { CategorySelect } from '../model/category';
import { PostSelect } from '../model/post';
import { Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
/**
 * 
 * MediatorService is implemented to break circular dependencies of services.
 * 
 * This service acts as a mediator between different services to handle updates and maintain consistency.
 * It provides a centralized place to manage API calls and data updates for related entities.
 * 
 * Imagine a scenario where a post gets updated, and as a result, its author and category are changed.
 * Now we need to make some updates to the userDto for both the old and new authors.
 * We should decrease the post count by one for the old author and increase it by one for the new author.
 * The same principle applies to the categories.
 * 
 * In handling these updates, I had two options.
 * The first was to code everything in the services and update the corresponding lists there.
 * The second option was to make API calls to update the userList and categoryList in the respective services.
 * 
 * However, considering the time constraints and the impracticality of updating everything solely through 
 * frontend code without connecting to the backend service, I decided to keep it simple by making API 
 * calls to update the data.
 * 
 * To maintain database consistency, separate API calls will be made in the mediator service for each scenario. 
 * This ensures accurate updates across the system.
 * 
 * There are cases where API calls are not needed, such as when creating a new user or category.
 * In such cases, the services simply push the new entity to their list and call the next() function.
 * 
 * It is important to note that the approaches suggested here may not be suitable 
 * in scenarios where multiple users are simultaneously interacting with the backend server.
 * In such cases, implementing web sockets could provide a more efficient solution 
 * to address concurrent updates.
 * 
 * The MediatorService also provides select options for user, category, 
 * and post entities, which can be used by reusable components to populate dropdown selects.
 * 
 * @see UserService
 * @see CategoryService
 * @see PostService
 * @see CommentService
 * 
 */
export class MediatorService implements OnDestroy{

  private putUserSubscription: Subscription;
  private putCategorySubscription: Subscription;
  private createPutPostSubscription: Subscription;
  private deletePostSubscription: Subscription;
  private createPutCommentSubscription: Subscription;
  private deleteCommentSubscription: Subscription;

  constructor(
    private userService: UserService,
    private categoryService: CategoryService,
    private postService: PostService,
    private commentService: CommentService) {

    this.putUserSubscription = this.userService.backendPutResponse$.subscribe(response =>
      this.refreshOnPutUser()
    );

    this.putCategorySubscription = this.categoryService.backendPutResponse$.subscribe(response =>
      this.refreshOnPutCategory()
    );

    this.createPutPostSubscription = postService.backendPostPutResponse$.subscribe(respoense =>
      this.refreshOnCreatePutPost()
    );

    this.deletePostSubscription = postService.backendDeleteResponse$.subscribe(response =>
      this.refreshOnDeletePost()
    );

    this.createPutCommentSubscription = commentService.backendPostPutResponse$.subscribe(response =>
      this.refreshOnCreatePutComment()
    );

    this.deleteCommentSubscription = commentService.backendDeleteResponse$.subscribe(response =>
      this.refreshOnDeleteComment()
    );

  }

  private refreshOnPutUser() {
    this.postService.getPosts();
    this.commentService.getComments();
  }

  private refreshOnPutCategory() {
    this.postService.getPosts();
  }

  private refreshOnDeletePost() {
    this.postService.getPosts();
    this.userService.getUsers();
    this.categoryService.getCategories();
  }

  private refreshOnCreatePutPost() {
    this.userService.getUsers();
    this.postService.getPosts();
    this.categoryService.getCategories();
    this.commentService.getComments();
  }

  private refreshOnDeleteComment() {
    this.commentService.getComments();
    this.userService.getUsers();
    this.postService.getPosts();
  }

  private refreshOnCreatePutComment() {
    this.commentService.getComments();
    this.userService.getUsers();
    this.postService.getPosts();
  }

  public getSelectUserOptions(): UserSelect[] {
    return this.userService.getAllUserIdsAndNames();
  }

  public getSelectCategoryOptions(): CategorySelect[] {
    return this.categoryService.getAllCategoryIdsAndNames();
  }

  public getSelectPostOptions(): PostSelect[] {
    return this.postService.getAllPostIdsAndNames();
  }

  ngOnDestroy(): void {
    this.putUserSubscription.unsubscribe();
    this.putCategorySubscription.unsubscribe();
    this.createPutPostSubscription.unsubscribe();
    this.deletePostSubscription.unsubscribe();
    this.createPutCommentSubscription.unsubscribe();
    this.deleteCommentSubscription.unsubscribe();
  }

}
