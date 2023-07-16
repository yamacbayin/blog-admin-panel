import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Post, PostDto, PostSelect } from '../model/post';
import { BehaviorSubject, Subject, catchError, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MappingService } from './mapping.service';

/**
 * Service for managing post-related operations, 
 * such as retrieving post data, creating, updating, and deleting posts.
 * 
 * @see UserService for details.
 */
@Injectable({
  providedIn: 'root'
})
export class PostService {

  private endpointUrl = "http://yamacbayin.com/posts";
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  private postList: PostDto[] = [];
  private postList$ = new BehaviorSubject<PostDto[]>(this.postList);
  public postListObservable$ = this.postList$.asObservable();

  private backendPostPutResponse = new Subject<PostDto>();
  public backendPostPutResponse$ = this.backendPostPutResponse.asObservable();

  private backendDeleteResponse = new Subject<PostDto>();
  public backendDeleteResponse$ = this.backendDeleteResponse.asObservable();

  constructor(
    private httpClient: HttpClient,
    private snackBar: MatSnackBar,
    private mappingService: MappingService
  ) {
    this.getPosts();
  }

  public getPosts() {
    this.httpClient.get<PostDto[]>(this.endpointUrl)
      .pipe(
        catchError((error) => {
          this.showAlert(error.error.error);
          return of([] as PostDto[]);
        })
      )
      .subscribe(list => {
        this.postList = list;
        this.postList$.next(this.postList);
      });
  }

  public createPost(postDto: PostDto) {

    let post = this.mappingService.postDtoToPostMapper(postDto);
    post = this.trimPostFields(post);

    if (this.validatePostFields(post)) {
      this.httpClient.post<Comment>(this.endpointUrl, post, { headers: this.headers, observe: "response" })
        .subscribe({
          next: (response: any) => {
            if (response.status === 200) {
              const returnedPost = this.mappingService.postToPostDtoMapper(response.body);
              this.postList.push(returnedPost);
              this.postList$.next(this.postList);
              this.backendPostPutResponse.next(returnedPost);
              this.showAlert("The post \"" + returnedPost.title + "\" has been added successfully.")
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

  public putPost(postDto: PostDto) {

    let post = this.mappingService.postDtoToPostMapper(postDto);
    post = this.trimPostFields(post);

    if (this.validatePostFields(post)) {
      this.httpClient.put<Post>(this.endpointUrl, post, { headers: this.headers, observe: "response" })
        .subscribe({
          next: (response: any) => {
            if (response.status === 200) {
              const returnedPost: PostDto = this.mappingService.postToPostDtoMapper(response.body);
              this.backendPostPutResponse.next(returnedPost);
              this.showAlert("The post " + returnedPost.title + " has been updated successfully.")
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

  public deletePost(postDto: PostDto) {
    if (postDto.comment_count > 0) {
      this.showAlert("Posts with comments cannot be deleted.");
    } else {
      const path = this.endpointUrl + "/id=" + postDto.post_id;
      this.httpClient.delete<Post>(path, { headers: this.headers, observe: "response" })
        .subscribe({
          next: (response: any) => {
            if (response.status === 200) {
              const deletedPost: PostDto = response.body;
              this.backendDeleteResponse.next(deletedPost);
              this.showAlert(`The post "${postDto.title}" has been deleted successfully.`)
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

  private trimPostFields(post: Post) {
    const { title, content, ...rest } = post;
    const trimmedPost = {
      title: title.trim(),
      content: content.trim(),
      ...rest
    }
    return trimmedPost;
  }

  private validatePostFields(post: Post) {
    if (post.user_id === null) {
      this.showAlert("User ID cannot be null.")
      return false;
    }
    if (post.category_id === null) {
      this.showAlert("Category ID cannot be null.")
      return false;
    }
    if (post.title.length === 0 || post.title.length > 50) {
      this.showAlert("Title must not be empty or exceed 50 characters.")
      return false;
    }
    if (post.content.length === 0) {
      this.showAlert("Content must not be empty.")
      return false;
    }
    return true;
  }

  public getAllPostIdsAndNames(): PostSelect[] {
    const selectPostOptions: PostSelect[] = this.postList.map(post =>
      this.mappingService.postDtoToPostSelectMapper(post));
    return selectPostOptions;
  }

  public findPostById(id: number): PostDto | undefined {
    return this.postList.find(post => {
      return post.post_id === id;
    })
  }

  public findAllPostsByUserId(id: number): PostDto[] {
    const list = this.postList.filter(post =>
      post.user_id === id
    );
    return list;
  }

  public findAllPostsByCategoryId(id: number): PostDto[] {
    const list = this.postList.filter(post =>
      post.category_id === id
    );
    return list;
  }

  showAlert(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 10000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
