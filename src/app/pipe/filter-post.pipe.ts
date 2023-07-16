import { Pipe, PipeTransform } from '@angular/core';
import { PostDto, PostFilter } from '../model/post';
@Pipe({
  name: 'filterPost'
})
export class FilterPostPipe implements PipeTransform {

  transform(posts: PostDto[] | null, filters: PostFilter): PostDto[] {
    if (!posts) {
      return [];
    }

    if (!filters || Object.values(filters).every(value => value === null || value === '')) {
      return posts;
    }

    const {
      post_id: id,
      username,
      user_id,
      title,
      category_name,
      category_id
    } = filters;

    return posts.filter(post => {


      const lowerCaseUsername = username ? username.toLowerCase() : '';
      const lowerCaseTitle = title ? title.toLowerCase() : '';
      const lowerCaseCategoryName = category_name ? category_name.toLowerCase() : '';

      const postIdMatch = id !== null ? post.post_id === id : true;
      const usernameMatch = username ? post.username.toLowerCase().includes(lowerCaseUsername) : true;
      const userIdMatch = user_id !== null ? post.user_id === user_id : true;
      const titleMatch = title ? post.title.toLowerCase().includes(lowerCaseTitle) : true;
      const categoryNameMatch = category_name ? post.category_name.toLowerCase().includes(lowerCaseCategoryName) : true;
      const categoryIdMatch = category_id !== null ? post.category_id === category_id : true;

      return postIdMatch && usernameMatch && userIdMatch
        && titleMatch && categoryNameMatch && categoryIdMatch;
    });
  }

}
