import { Injectable } from '@angular/core';
import { User, UserDto, UserSelect } from '../model/user';
import { Category, CategoryDto, CategorySelect } from '../model/category';
import { Post, PostDto, PostSelect } from '../model/post';
import { Comment, CommentDto } from '../model/comment';

@Injectable({
  providedIn: 'root'
})
export class MappingService {

  constructor() { }

  public categoryToCategoryDtoMapper(category: Category): CategoryDto {
    return {
      ...category,
      post_count: 0,
    };
  }

  public categoryDtoToCategoryMapper(categoryDto: CategoryDto): Category {
    let { post_count, ...category } = categoryDto;
    return category;
  }

  public categoryDtoToCategorySelectMapper(categoryDto: CategoryDto): CategorySelect {
    const { category_id, name } = categoryDto;
    return {
      category_id,
      name
    };
  }

  public userDtoToUserMapper(userDto: UserDto): User {
    let {post_count, comment_count, ...user} = userDto;
    return user;
  }

  public userToUserDtoMapper(user: User): UserDto {
    return {
      ...user,
      post_count: 0,
      comment_count: 0
    };
  }

  public userDtoToUserSelectMapper(userDto: UserDto): UserSelect {
    const { user_id, username } = userDto;
    return {
      user_id,
      username
    };
  }
  
  public postToPostDtoMapper(post: Post): PostDto {
    return {
      ...post,
      username: '', 
      category_name: '', 
      comment_count: 0 
    };
  }

  public postDtoToPostMapper(postDto: PostDto): Post {
    let { username, category_name, comment_count, ...post } = postDto;
    return post;
  }

  
  public postDtoToPostSelectMapper(postDto: PostDto): PostSelect {
    const { post_id, title } = postDto;
    return {
      post_id,
      title
    };
  }

  public commentToCommentDtoMapper(comment: Comment): CommentDto {
    return {
      ...comment,
      username: '', 
      post_title: ''
    };
  }

  public commentDtoToCommentMapper(commentDto: CommentDto): Comment {
    let { username, post_title, ...comment } = commentDto;
    return comment;
  }
  
}
