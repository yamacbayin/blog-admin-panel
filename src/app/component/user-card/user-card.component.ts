import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserDto } from 'src/app/model/user';

/**
 * Card Component
 * 
 * The Card Component is designed to present detailed information about an object and offers 
 * various actions such as editing, activating the details route, or deleting the user
 * associated with the object.
 * 
 * @example
 * <app-user-card
 * [user]="selectedUser"
 * (editUser)="onEditUser($event)"
 * (deleteUser)="onDeleteUser($event)">
 * </app-user-card>
 * 
 * @param user - The user object containing user details to be displayed.
 * @param detailsMode - A boolean indicating whether the card is in 
 * details mode or not. In details mode, details button is hidden.
 * @param editUser - An event emitter triggered when the edit button or the card header is clicked.
 * It emits the object to be shown on UserEditCardComponent.
 * @param deleteUser - An event emitter triggered when the user delete action is invoked. 
 * It emits the user object to be deleted.
 * 
 */
@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
  @Input() user!: UserDto;
  @Input() detailsMode: boolean = false;
  @Output() editUser = new EventEmitter<UserDto>();
  @Output() deleteUser = new EventEmitter<UserDto>();

  onEditUser(): void {
    this.editUser.emit(this.user);
  }

  onDeleteUser(): void {
    let text = "Are you sure about deleting the user " + this.user.username + "?";
    if (confirm(text) == true) {
      this.deleteUser.emit(this.user);
    }
  }

}
