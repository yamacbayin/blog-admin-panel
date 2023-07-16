import { Component, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { UserDto } from 'src/app/model/user';

/**
 * Edit Card Component
 * 
 * This component provides a multi-purpose edit card that can be used to view, edit, and create objects.
 * It supports different modes: view mode, edit mode, and create mode.
 * 
 * View Mode:
 * * The default view mode displays information about the given object and includes all card buttons.
 * * The details view mode is a sub-state of the view mode 
 * * and hides the detail button when inside the details route.
 * 
 * Edit Mode:
 * * The edit mode allows users to modify the object's properties.
 * * It can be toggled on and off in the view mode.
 * 
 * Create Mode:
 * * The create mode is a specialized edit mode shown in the create route.
 * * All input fields are empty, and the edit mode cannot be toggled off.
 * 
 * Usage:
 * * Pass the selected object to the component using the selectedObject input.
 * * Set the createMode input to true to activate the create mode.
 * * Set the detailsMode input to true when in the details route to activate the details view mode.
 * * Listen to the persistObject output event to handle saving or updating the object.
 * * Listen to the deleteObject output event to handle deleting the object.
 * 
 * @example
 * <app-edit-card
 * [selectedObject]="selectedItem"
 * [createMode]="isNewItem"
 * [detailsMode]="isInDetailsRoute"
 * (persistObject)="saveOrUpdateItem($event)"
 * (deleteObject)="deleteItem($event)">
 * </app-edit-card>
 * 
 */
@Component({
  selector: 'app-user-edit-card',
  templateUrl: './user-edit-card.component.html',
  styleUrls: ['./user-edit-card.component.css']
})
export class UserEditCardComponent implements OnChanges {

  @Input() selectedUser: UserDto | undefined = undefined;
  @Input() createMode: boolean = false;
  @Input() detailsMode: boolean = false;
  @Output() persistUser = new EventEmitter<UserDto>();
  @Output() deleteUser = new EventEmitter<UserDto>();

  editMode: boolean = false;
  editedUser!: UserDto;

  pickedDate: Date | null = null;
  pickedTime: string | null = null;

  usernameInput = new FormControl('', [Validators.required, this.noSpacesValidator()]);
  emailInput = new FormControl('', [Validators.required, this.noSpacesValidator()]);

  ngOnInit(): void {
    if (this.createMode) {
      this.initializeCreateMode();
    }
  }

  /**
   * Observe changes in the selectedUser input and update the fields accordingly.
   * 
   * @param changes - The changes detected in the input properties.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedUser'] && changes['selectedUser'].currentValue) {
      this.editMode = false;
      this.initializeEditedUser();
      const parts = this.selectedUser?.creation_date.split('T');
      this.pickedDate = new Date(parts![0]);
      const timeParts = parts![1].split(':');
      this.pickedTime = timeParts[0] + ':' + timeParts[1];
    }
  }

  /**
   * Toggles the edit mode on and off.
   */
  toggleEditMode() {
    if (this.editMode) {
      this.initializeEditedUser();
    }
    this.editMode = !this.editMode;
  }

  onSaveOrUpdateClick() {
    if (!this.usernameInput.invalid && !this.emailInput.invalid) {
      this.persistUser.emit(this.editedUser);
    }
  }

  onDeleteUser(): void {
    let text = "Are you sure about deleting the user " + this.selectedUser?.username + "?";
    if (confirm(text) == true) {
      this.deleteUser.emit(this.selectedUser);
    }
  }

  /**
   * Handles the change event of the date picker and time picker
   * to update the pickedDate and pickedTime values.
   */
  onDateChange() {
    this.formatSelectedTime()
  }

  /**
   * Initializes the editedUser object based on the selectedUser.
   */
  private initializeEditedUser() {
    this.editedUser = {
      user_id: this.selectedUser?.user_id ?? 0,
      username: this.selectedUser?.username ?? "",
      email: this.selectedUser?.email ?? "",
      creation_date: this.selectedUser?.creation_date ?? "",
      is_active: this.selectedUser?.is_active ?? false,
      post_count: this.selectedUser?.post_count ?? 0,
      comment_count: this.selectedUser?.comment_count ?? 0
    };
  }

  /**
   * Initializes an empty user.
   */
  private initializeCreateMode() {
    this.editedUser = {
      user_id: 0,
      username: "",
      email: "",
      creation_date: "",
      is_active: false,
      post_count: 0,
      comment_count: 0
    };
    this.editMode = true;
  }

  /**
   * Custom validator function to check if the input value contains spaces.
   * 
   * @returns Validator function that validates if the input value contains spaces.
   */
  noSpacesValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value && control.value.trim().split(' ').length > 1) {
        return { hasSpaces: true };
      }
      return null;
    };
  }

  /**
   * Formats the selected time and updates the editedUser's creation_date property.
   */
  formatSelectedTime() {
    const timeParts = this.pickedTime?.split(':');
    if (timeParts && timeParts.length === 2) {
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      if (this.pickedDate) {
        this.pickedDate.setUTCHours(hours, minutes, 0, 0);
      }
    } else {
      const currentDateParts = this.pickedDate?.toISOString().split('T');
      const currentDateTimeParts = currentDateParts![1].split(':');
      this.pickedTime = currentDateTimeParts[0] + ':' + currentDateTimeParts[1];
    }
    const isoStringParts = this.pickedDate!.toISOString().split('T');
    const isoTimeParts = isoStringParts[1].split(':');
    const finalDateTime = isoStringParts[0] + 'T' + isoTimeParts[0] + ':' + isoTimeParts[1] + ':01+00:00';
    this.editedUser.creation_date = finalDateTime;
  }
}

