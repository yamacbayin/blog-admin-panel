export interface User {
    user_id: number,
    username: string,
    email: string,
    creation_date: string,
    is_active: boolean
}

/**
 * Data Transfer Objects (DTOs) are objects returned by backend server's GET all endpoints.
 * They contain additional fields to facilitate operations and provide enhanced functionality.
 */
export interface UserDto {
    user_id: number,
    username: string,
    email: string,
    creation_date: string,
    is_active: boolean,
    post_count: number,
    comment_count: number
}

/**
 * 
 * Represents the options used in dropdown selects.
 * @interface UserSelect
 * @property {number} user_id - The ID of the user.
 * @property {string} username - The username of the user.
 */
export interface UserSelect {
    user_id: number,
    username: string
}
