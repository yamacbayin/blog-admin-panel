export interface Category {
    category_id: number,
    name: string,
    creation_date: string
}

/**
 * Data Transfer Objects (DTOs) are objects returned by backend server's GET all endpoints.
 * They contain additional fields to facilitate operations and provide enhanced functionality.
 */
export interface CategoryDto {
    category_id: number,
    name: string,
    creation_date: string,
    post_count: number
}

/**
 * 
 * Represents the options used in dropdown selects.
 * @interface CategorySelect
 * @property {number} category_id - The ID of the category.
 * @property {string} name - The name of the category.
 */
export interface CategorySelect {
    category_id: number,
    name: string
}