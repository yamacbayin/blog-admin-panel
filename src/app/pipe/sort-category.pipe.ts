import { Pipe, PipeTransform } from '@angular/core';
import { CategoryDto } from '../model/category';
@Pipe({
  name: 'sortCategories',
  pure: false
})
export class SortCategoryPipe implements PipeTransform {

  transform(categories: CategoryDto[], sortOption: string): CategoryDto[] {

    if (!categories || !sortOption) {
      return categories;
    }

    let [sortField, sortOrder] = sortOption.split('-');
    let sortedCategories: CategoryDto[] = [...categories];

    switch (sortField) {
      case 'categoryId':
        sortedCategories.sort((a, b) => a.category_id - b.category_id);
        break;
      case 'categoryName':
        sortedCategories.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'date':
        sortedCategories.sort((a, b) => new Date(a.creation_date).getTime() - new Date(b.creation_date).getTime());
        break;
      default:
        // Default to sorting by category_id if sortField is unrecognized
        sortedCategories.sort((a, b) => a.category_id - b.category_id);
        break;
    }

    if (sortOrder === 'desc') {
      sortedCategories.reverse();
    }

    return sortedCategories;
  }

}
