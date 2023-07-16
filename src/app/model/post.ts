export interface Post {
    post_id: number,
    user_id: number,
    category_id: number,
    title: string,
    content: string,
    view_count: number,
    creation_date: string,
    is_published: boolean
}

/**
 * Data Transfer Objects (DTOs) are objects returned by backend server's GET all endpoints.
 * They contain additional fields to facilitate operations and provide enhanced functionality.
 */
export interface PostDto {
    post_id: number,
    user_id: number,
    category_id: number,
    title: string,
    content: string,
    view_count: number,
    creation_date: string,
    is_published: boolean
    username: string,
    category_name: string,
    comment_count: number
}

/**
 * 
 * Represents the options used in dropdown selects.
 * @interface PostSelect
 * @property {number} post_id - The ID of the post.
 * @property {string} title - The title of the post.
 */
export interface PostSelect {
    post_id: number,
    title: string
}

/**
 * Represents the filters applied to the post list.
 */
export interface PostFilter {
    post_id: number | null,
    username: string | null;
    user_id: number | null;
    title: string | null;
    category_name: string | null;
    category_id: number | null;
}