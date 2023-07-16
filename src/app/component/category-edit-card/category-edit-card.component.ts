import { Component, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { CategoryDto } from 'src/app/model/category';

/**
 * Edit Card Component
 * 
 * The Edit Card Component allows users to view and modify various inputs of a post or comment. 
 * It offers select options for editing specific fields, 
 * providing a convenient way to update the content.
 * 
 * For more detailed explanations, @see {UserEditCardComponent} and @see {PostEditCardComponent}.
 * 
 */
@Component({
  selector: 'app-category-edit-card',
  templateUrl: './category-edit-card.component.html',
  styleUrls: ['./category-edit-card.component.css']
})
export class CategoryEditCardComponent {

  @Input() selectedCategory: CategoryDto | undefined = undefined;
  @Input() createMode: boolean = false;
  @Input() detailsMode: boolean = false;
  @Output() persistCategory = new EventEmitter<CategoryDto>();
  @Output() deleteCategory = new EventEmitter<CategoryDto>();

  editMode: boolean = false;
  editedCategory!: CategoryDto;

  pickedDate: Date | null = null;
  pickedTime: string | null = null;

  ngOnInit(): void {
    if (this.createMode) {
      this.initializeCreateMode();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCategory'] && changes['selectedCategory'].currentValue) {
      this.editMode = false;
      this.initializeEditedCategory();

      const parts = this.editedCategory?.creation_date.split('T');
      this.pickedDate = new Date(parts![0]);
      const timeParts = parts![1].split(':');
      this.pickedTime = timeParts[0] + ':' + timeParts[1];
    }
  }

  toggleEditMode() {
    if (this.editMode) {
      this.initializeEditedCategory();
    }
    this.editMode = !this.editMode;
  }

  onSaveOrUpdateClick() {
    this.persistCategory.emit(this.editedCategory);
  }

  onDeleteCategory(): void {
    let text = "Are you sure about deleting the category " + this.selectedCategory?.name + "?";
    if (confirm(text) == true) {
      this.deleteCategory.emit(this.selectedCategory);
    }
  }

  onDateChange() {
    this.formatSelectedTime()
  }


  private initializeEditedCategory() {
    this.editedCategory = {
      category_id: this.selectedCategory?.category_id ?? 0,
      name: this.selectedCategory?.name ?? "",
      creation_date: this.selectedCategory?.creation_date ?? "",
      post_count: this.selectedCategory?.post_count ?? 0,
    };
  }

  private initializeCreateMode() {
    this.editedCategory = {
      category_id: 0,
      name: "",
      creation_date: "",
      post_count: 0,
    };
    this.editMode = true;
  }

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
    this.editedCategory.creation_date = finalDateTime;
  }
}
