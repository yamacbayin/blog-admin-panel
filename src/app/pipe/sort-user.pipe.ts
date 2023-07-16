import { Pipe, PipeTransform } from '@angular/core';
import { UserDto } from '../model/user';

@Pipe({
  name: 'sortUsers',
  pure: false
})
export class SortUserPipe implements PipeTransform {

  transform(users: UserDto[], sortOption: string): UserDto[] {

    if (!users || !sortOption) {
      return users;
    }

    let [sortField, sortOrder] = sortOption.split('-');
    let sortedUsers: UserDto[] = [...users];

    switch (sortField) {
      case 'id':
        sortedUsers.sort((a, b) => a.user_id - b.user_id);
        break;
      case 'cd':
        sortedUsers.sort((a, b) => new Date(a.creation_date).getTime() - new Date(b.creation_date).getTime());
        break;
      case 'postc':
        sortedUsers.sort((a, b) => a.post_count - b.post_count);
        break;
      case 'commentc':
        sortedUsers.sort((a, b) => a.comment_count - b.comment_count);
        break;
      default:
        // Default to sorting by user_id if sortField is unrecognized
        sortedUsers.sort((a, b) => a.user_id - b.user_id);
        break;
    }

    if (sortOrder === 'desc') {
      sortedUsers.reverse();
    }

    return sortedUsers;

  }
}
