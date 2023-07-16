import { Pipe, PipeTransform } from '@angular/core';
import { CategoryDto } from '../model/category';

@Pipe({
  name: 'filterCategory'
})
export class FilterCategoryPipe implements PipeTransform {

  transform(categories: CategoryDto[] | null,
    filterName: string,
    filterId: number | null): CategoryDto[] {

    if (!categories) {
      return [];
    }

    if ((!filterName || filterName.trim() === '') && (!filterId || isNaN(filterId))) {
      return categories;
    }

    const lowerCaseFilterName = filterName ? filterName.toLowerCase() : '';

    return categories.filter(category => {
      const categoryIdMatch = filterId !== null ? category.category_id === filterId : true;
      const nameMatch = filterName ? category.name.toLowerCase().includes(lowerCaseFilterName) : true;
      return categoryIdMatch && nameMatch;
    });
  }

}
