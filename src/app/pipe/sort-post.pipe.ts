import { Pipe, PipeTransform } from '@angular/core';
import { PostDto } from '../model/post';

@Pipe({
  name: 'sortPosts',
  pure: false
})
export class SortPostPipe implements PipeTransform {

  transform(posts: PostDto[], sortOption: string): PostDto[] {

    if (!posts || !sortOption) {
      return posts;
    }

    let [sortField, sortOrder] = sortOption.split('-');
    let sortedPosts: PostDto[] = [...posts];

    switch (sortField) {
      case 'postId':
        sortedPosts.sort((a, b) => a.post_id - b.post_id);
        break;
      case 'userId':
        sortedPosts.sort((a, b) => a.user_id - b.user_id);
        break;
      case 'categoryId':
        sortedPosts.sort((a, b) => a.category_id - b.category_id);
        break;
      case 'viewCount':
        sortedPosts.sort((a, b) => a.view_count - b.view_count);
        break;
      case 'date':
        sortedPosts.sort((a, b) => new Date(a.creation_date).getTime() - new Date(b.creation_date).getTime());
        break;
      default:
        // Default to sorting by post_id if sortField is unrecognized
        sortedPosts.sort((a, b) => a.post_id - b.post_id);
        break;
    }

    if (sortOrder === 'desc') {
      sortedPosts.reverse();
    }

    return sortedPosts;
  }

}
