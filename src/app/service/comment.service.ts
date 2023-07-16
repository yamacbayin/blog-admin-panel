import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Comment, CommentDto } from '../model/comment';
import { BehaviorSubject, Subject, catchError, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MappingService } from './mapping.service';

/**
 * Service for managing comment-related operations, 
 * such as retrieving comment data, creating, updating, and deleting comments.
 * 
 * @see UserService for details.
 */
@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private endpointUrl = "http://yamacbayin.com/comments";
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  private commentList: CommentDto[] = [];
  private commentList$ = new BehaviorSubject<CommentDto[]>(this.commentList);
  public commentListObservable$ = this.commentList$.asObservable();

  private backendPostPutResponse = new Subject<CommentDto>();
  public backendPostPutResponse$ = this.backendPostPutResponse.asObservable();

  private backendDeleteResponse = new Subject<CommentDto>();
  public backendDeleteResponse$ = this.backendDeleteResponse.asObservable();

  constructor(
    private httpClient: HttpClient,
    private snackBar: MatSnackBar,
    private mappingService: MappingService
  ) {
    this.getComments();
  }

  getComments() {
    this.httpClient.get<CommentDto[]>(this.endpointUrl)
      .pipe(
        catchError((error) => {
          this.showAlert(error.error.error);
          return of([] as CommentDto[]);
        })
      )
      .subscribe(list => {
        this.commentList = list;
        this.commentList$.next(this.commentList);
      });
  }

  public createComment(commentDto: CommentDto) {

    let comment = this.mappingService.commentDtoToCommentMapper(commentDto);
    comment = this.trimCommentFields(comment);

    if (this.validateCommentFields(comment)) {
      this.httpClient.post<Comment>(this.endpointUrl, comment, { headers: this.headers, observe: "response" })
        .subscribe({
          next: (response: any) => {
            if (response.status === 200) {
              const returnedComment = this.mappingService.commentToCommentDtoMapper(response.body);
              this.commentList.push(returnedComment);
              this.commentList$.next(this.commentList);
              this.backendPostPutResponse.next(returnedComment);
              this.showAlert("The comment \"" + returnedComment.comment + "\" has been added successfully.")
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


  public putComment(commentDto: CommentDto) {
    let comment = this.mappingService.commentDtoToCommentMapper(commentDto);
    comment = this.trimCommentFields(comment);

    if (this.validateCommentFields(comment)) {
      this.httpClient.put<Comment>(this.endpointUrl, comment, { headers: this.headers, observe: "response" })
        .subscribe({
          next: (response: any) => {
            if (response.status === 200) {
              const returnedComment: CommentDto = response.body;
              this.backendPostPutResponse.next(returnedComment);
              this.showAlert("The comment " + returnedComment.comment + " has been updated successfully.")
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

  public deleteComment(commentDto: CommentDto) {
    const path = this.endpointUrl + "/id=" + commentDto.comment_id;
    this.httpClient.delete<Comment>(path, { headers: this.headers, observe: "response" })
      .subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            const deletedComment: CommentDto = response.body;
            this.backendDeleteResponse.next(deletedComment);
            this.showAlert(`The comment "${deletedComment.comment}" has been deleted successfully.`)
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

  private trimCommentFields(commentObject: Comment) {
    const { comment, ...rest } = commentObject;
    const trimmedComment = {
      comment: comment.trim(),
      ...rest
    }
    return trimmedComment;
  }

  private validateCommentFields(comment: Comment) {
    if (comment.user_id === null) {
      this.showAlert("User ID cannot be null.")
      return false;
    }
    if (comment.post_id === null) {
      this.showAlert("Post ID cannot be null.")
      return false;
    }
    if (comment.comment.length === 0) {
      this.showAlert("Comment must not be empty.")
      return false;
    }
    return true;
  }

  public findCommentById(id: number): CommentDto | undefined {
    return this.commentList.find(comment => {
      return comment.comment_id === id;
    })
  }

  public findAllCommentsByUserId(id: number): CommentDto[] {
    const list = this.commentList.filter(comment =>
      comment.user_id === id
    );
    return list;
  }

  public findAllCommentsByPostId(id: number): CommentDto[] {
    const list = this.commentList.filter(comment =>
      comment.post_id === id
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
