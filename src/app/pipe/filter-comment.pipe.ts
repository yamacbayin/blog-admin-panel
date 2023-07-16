import { Pipe, PipeTransform } from '@angular/core';
import { CommentDto, CommentFilter } from '../model/comment';
@Pipe({
  name: 'filterComment'
})
export class FilterCommentPipe implements PipeTransform {

  transform(comments: CommentDto[] | null, filter: CommentFilter): CommentDto[] {
    if (!comments) {
      return [];
    }

    if (!filter) {
      return comments;
    }

    const { comment_id, post_id, user_id, username, post_title, comment: commentText } = filter;

    return comments.filter(comment => {

      const commentIdMatch = comment_id !== null ? comment.comment_id === comment_id : true;
      const postIdMatch = post_id !== null ? comment.post_id === post_id : true;
      const userIdMatch = user_id !== null ? comment.user_id === user_id : true;
      const usernameMatch = username ? comment.username.toLowerCase().includes(username.toLowerCase()) : true;
      const postTitleMatch = post_title ? comment.post_title.toLowerCase().includes(post_title.toLowerCase()) : true;
      const commentTextMatch = commentText ? comment.comment.toLowerCase().includes(commentText.toLowerCase()) : true;

      return commentIdMatch && postIdMatch && userIdMatch
        && usernameMatch && postTitleMatch && commentTextMatch;
    });
  }

}
