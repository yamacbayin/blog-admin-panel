import { Pipe, PipeTransform } from '@angular/core';
import { CommentDto } from '../model/comment';

@Pipe({
  name: 'sortComments',
  pure: false
})
export class SortCommentPipe implements PipeTransform {

  transform(comments: CommentDto[], sortOption: string): CommentDto[] {

    if (!comments || !sortOption) {
      return comments;
    }

    let [sortField, sortOrder] = sortOption.split('-');
    let sortedComments: CommentDto[] = [...comments];

    switch (sortField) {
      case 'commentId':
        sortedComments.sort((a, b) => a.comment_id - b.comment_id);
        break;
      case 'postId':
        sortedComments.sort((a, b) => a.post_id - b.post_id);
        break;
      case 'userId':
        sortedComments.sort((a, b) => a.user_id - b.user_id);
        break;
      case 'date':
        sortedComments.sort((a, b) => new Date(a.creation_date).getTime() - new Date(b.creation_date).getTime());
        break;
      default:
        // Default to sorting by comment_id if sortField is unrecognized
        sortedComments.sort((a, b) => a.comment_id - b.comment_id);
        break;
    }

    if (sortOrder === 'desc') {
      sortedComments.reverse();
    }

    return sortedComments;
  }
}
