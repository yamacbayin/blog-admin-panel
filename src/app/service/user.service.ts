import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Subject, map, tap } from 'rxjs';
import { User, UserDto, UserSelect } from '../model/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MappingService } from './mapping.service';

/**
 * Service for managing user-related operations, 
 * such as retrieving user data, creating, updating, and deleting users.
 * 
 * @remarks
 * The UserService acts as a bridge between the frontend application 
 * and the backend API endpoints for user operations.
 * It handles API calls, updates user lists, and provides data for user-related components.
 * 
 * @param {HttpClient} httpClient - The Angular HttpClient module for making HTTP requests.
 * @param {MatSnackBar} snackBar - The Angular Material MatSnackBar module for displaying alert messages.
 * @param {MappingService} mappingService - The MappingService for mapping between different user models.
 * 
 * @property {string} endpointUrl - The URL of the user API endpoint.
 * @property {HttpHeaders} headers - The HttpHeaders for setting the request headers.
 * @property {UserDto[]} userList - The array of UserDto objects representing the user list.
 * @property {BehaviorSubject<UserDto[]>} userList$ - The BehaviorSubject for observing user list changes.
 * @property {Subject<UserDto>} backendPostResponse - The Subject for observing backend POST responses.
 * @property {Subject<UserDto>} backendPutResponse - The Subject for observing backend PUT responses.
 * @property {Subject<UserDto>} backendDeleteResponse - The Subject for observing backend DELETE responses.
 *
 * @constructor
 * Creates an instance of UserService.
 *
 * @param {HttpClient} httpClient - The Angular HttpClient module for making HTTP requests.
 * @param {MatSnackBar} snackBar - The Angular Material MatSnackBar module for displaying alert messages.
 * @param {MappingService} mappingService - The MappingService for mapping between different user models.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private endpointUrl = "http://yamacbayin.com/users";
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  private userList: UserDto[] = [];
  private userList$ = new BehaviorSubject<UserDto[]>(this.userList);
  public userListObservable$ = this.userList$.asObservable();

  private backendPostResponse = new Subject<UserDto>();
  public backendPostResponse$ = this.backendPostResponse.asObservable();

  private backendPutResponse = new Subject<UserDto>();
  public backendPutResponse$ = this.backendPutResponse.asObservable();

  private backendDeleteResponse = new Subject<UserDto>();
  public backendDeleteResponse$ = this.backendDeleteResponse.asObservable();

  /**
   * Initializes an instance of UserService.
   * Retrieves the initial user list from the backend API.
   */
  constructor(
    private httpClient: HttpClient,
    private snackBar: MatSnackBar,
    private mappingService: MappingService
  ) {
    this.getUsers();
  }

  /**
   * Retrieves the user list from the backend API.
   * Updates the userList array and userList$ BehaviorSubject with the fetched data.
   */
  public getUsers() {
    this.httpClient.get<UserDto[]>(this.endpointUrl).pipe(
      //This code is not necessary but I will leave it here for the purpose of demonstration.
      map(o => o.map((userDto: UserDto) => ({
        user_id: userDto.user_id,
        username: userDto.username,
        email: userDto.email,
        creation_date: userDto.creation_date,
        is_active: userDto.is_active,
        post_count: userDto.post_count,
        comment_count: userDto.comment_count
      }
      ))),
      tap((userList: UserDto[]) => {
        this.userList = userList;
        this.userList$.next(userList);
      })
    ).subscribe();
  }

  /**
   * Creates a new user by making a POST request to the backend API.
   * Adds the created user to the userList array and emits the updated user list.
   * Shows a success or error alert message based on the response.
   * 
   * @param {UserDto} userDto - The UserDto object representing the user to be created.
   */
  public createUser(userDto: UserDto) {
    let user = this.mappingService.userDtoToUserMapper(userDto);
    user = this.trimUserFields(user);

    if (this.validateUserFields(user)) {
      this.httpClient.post<User>(this.endpointUrl, user, { headers: this.headers, observe: "response" })
        .subscribe({
          next: (response: any) => {
            if (response.status === 200) {
              // Successful response with status code 200
              // Push the new user to the userList
              const returnedUser = this.mappingService.userToUserDtoMapper(response.body);
              this.userList.push(returnedUser);
              this.userList$.next(this.userList);
              this.backendPostResponse.next(returnedUser);
              this.showAlert("The user " + returnedUser.username + " has been added successfully.")
            } else {
              this.showAlert("Unexpected status code: " + response.status + "\n" + response.body);
            }
          },
          error: (errorResponse) => {
            // Handle any errors here
            if (!errorResponse.error.error) {
              this.showAlert(errorResponse.error.detail + " - " + errorResponse.error.title);
            } else {
              this.showAlert(errorResponse.error.error);
            }

          }
        });
    }
  }
  /**
   * Updates an existing user by making a PUT request to the backend API.
   * Updates the user in the userList array and emits the updated user list.
   * Shows a success or error alert message based on the response.
   * 
   * @param {UserDto} userDto - The UserDto object representing the user to be updated.
   */
  public putUser(userDto: UserDto) {

    let user = this.mappingService.userDtoToUserMapper(userDto);
    user = this.trimUserFields(user);

    if (this.validateUserFields(user)) {
      this.httpClient.put<User>(this.endpointUrl, user, { headers: this.headers, observe: "response" })
        .subscribe({
          next: (response: any) => {
            if (response.status === 200) {
              const returnedUser = this.mappingService.userToUserDtoMapper(response.body);
              returnedUser.comment_count = userDto.comment_count;
              returnedUser.post_count = userDto.post_count;
              this.updateUserInUserList(returnedUser);
              this.backendPutResponse.next(returnedUser);
              this.showAlert("The user " + returnedUser.username + " has been updated successfully.")
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

  /**
   * 
   * If I hadn't specifically coded the backend for this project, 
   * I would have written functions in the PostService and CommentService. 
   * These functions would utilize filters, reduces, or for...of loops to 
   * retrieve the user's posts and comments in the necessary components.
   * When it comes to deleting the user, I would take into consideration 
   * the length of these arrays to ensure all associated data is properly handled.
   * 
   */

  /**
   * Deletes a user by making a DELETE request to the backend API.
   * Removes the deleted user from the userList array and emits the updated user list.
   * Shows a success or error alert message based on the response.
   * 
   * @param {UserDto} userDto - The UserDto object representing the user to be deleted.
   */
  public deleteUser(userDto: UserDto) {
    if (this.userList.length === 1) {
      this.showAlert("The last user cannot be deleted.");
    } else if (userDto.post_count > 0) {
      this.showAlert("Users with posts cannot be deleted");
    } else if (userDto.comment_count > 0) {
      this.showAlert("Users with comments cannot be deleted.");
    } else {
      const path = this.endpointUrl + "/id=" + userDto.user_id;
      this.httpClient.delete<User>(path, { headers: this.headers, observe: "response" })
        .subscribe({
          next: (response: any) => {
            if (response.status === 200) {
              const returnedUser = response.body;
              this.deleteUserInUserList(returnedUser);
              this.userList$.next(this.userList);
              this.backendDeleteResponse.next(returnedUser);
              this.showAlert(`The user "${returnedUser.username}" has been deleted successfully.`)
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

  /**
   * Trims the unnecessary whitespace from the username and email fields of a user object.
   * 
   * @param {User} user - The User object to be trimmed.
   * @returns {User} The trimmed User object.
   */
  private trimUserFields(user: User): User {
    const { username, email, ...rest } = user;
    const trimmedUser = {
      username: username.trim(),
      email: email.trim(),
      ...rest
    }
    return trimmedUser;
  }

  /**
   * Validates the username and email fields of a user object.
   * Shows an error alert message if the fields are invalid.
   * 
   * @param {User} user - The User object to be validated.
   * @returns {boolean} A boolean indicating whether the user fields are valid.
   */
  private validateUserFields(user: User): boolean {
    if (user.username.length <= 3 || user.username.length > 30) {
      this.showAlert("Username must be between 4 and 30 characters.")
      return false;
    }
    if (user.email.length <= 3 || user.email.length > 70) {
      this.showAlert("Email must be between 4 and 70 characters.")
      return false;
    }
    return true;
  }

  /**
   * Updates a user in the userList array based on the returned user object.
   * Emits the updated user list.
   * 
   * @param {UserDto} updatedUser - The updated UserDto object.
   */
  private updateUserInUserList(updatedUser: UserDto) {
    const index = this.userList.findIndex(userDto => userDto.user_id === updatedUser.user_id);
    if (index !== -1) {
      this.userList[index] = updatedUser;
      this.userList$.next(this.userList);
    } else {
      this.getUsers();
    }
  }

  /**
   * Deletes a user from the userList array based on the returned user object.
   * Emits the updated user list.
   * 
   * @param {UserDto} deletedUser - The deleted UserDto object.
   */
  private deleteUserInUserList(deletedUser: UserDto) {
    const index = this.userList.findIndex(userDto => userDto.user_id === deletedUser.user_id);

    if (index !== -1) {
      this.userList.splice(index, 1);
      this.userList$.next(this.userList);
    } else {
      this.getUsers();
    }
  }

  /**
   * Retrieves an array of UserSelect objects containing the IDs and names of all users.
   * 
   * @returns {UserSelect[]} An array of UserSelect objects representing the user select options.
   */
  public getAllUserIdsAndNames(): UserSelect[] {
    const selectUserOptions: UserSelect[] = this.userList.map(user =>
      this.mappingService.userDtoToUserSelectMapper(user));
    return selectUserOptions;
  }

  /**
   * Finds a user in the userList array based on the given user ID.
   * 
   * @param {number} id - The ID of the user to be found.
   * @returns {UserDto | undefined} The UserDto object representing the found user, or undefined if not found.
   */
  public findUserById(id: number): UserDto | undefined {
    return this.userList.find(user => {
      return user.user_id === id;
    })
  }

  /**
   * Shows an alert message using the MatSnackBar module.
   * 
   * @param {string} message - The message to be displayed in the alert.
   */
  showAlert(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 10000, // Set the duration for the alert message to display
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

}
