export interface Comment {
    comment_id: number;
    post_id: number,
    user_id: number,
    comment: string,
    creation_date: string,
    is_confirmed: boolean
}

/**
 * Data Transfer Objects (DTOs) are objects returned by backend server's GET all endpoints.
 * They contain additional fields to facilitate operations and provide enhanced functionality.
 */
export interface CommentDto {
    comment_id: number;
    post_id: number,
    user_id: number,
    comment: string,
    creation_date: string,
    is_confirmed: boolean,
    username: string,
    post_title: string
}

/**
 * Represents the filters applied to the comment list.
 */
export interface CommentFilter {
    comment_id: number | null;
    post_id: number | null;
    user_id: number | null;
    username: string | null;
    post_title: string | null;
    comment: string | null;
  }