import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryDto } from 'src/app/model/category';

/**
 * Card Component
 * 
 * The Card Component is designed to present detailed information about an object and offers 
 * various actions such as editing, activating the details route, or deleting the user
 * associated with the object.
 * 
 * @see {UserCardComponent} for details.
 * 
 */
@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.css']
})
export class CategoryCardComponent {
  @Input() category!: CategoryDto;
  @Input() detailsMode: boolean = false;
  @Output() editCategory = new EventEmitter<CategoryDto>();
  @Output() deleteCategory = new EventEmitter<CategoryDto>();

  onEditCategory(): void {
    this.editCategory.emit(this.category);
  }

  onDeleteCategory(): void {
    let text = "Are you sure about deleting the category " + this.category.name + "?";
    if (confirm(text) == true) {
      this.deleteCategory.emit(this.category);
    }
  }

}
