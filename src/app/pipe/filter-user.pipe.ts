import { Pipe, PipeTransform } from '@angular/core';
import { UserDto } from '../model/user';

@Pipe({
  name: 'filterUser'
})
export class FilterUserPipe implements PipeTransform {

  transform(users: UserDto[] | null,
    filterUserId: number | null,
    filterUsername: string
  ): UserDto[] {

    if (!users) {
      return [];
    }

    if ((!filterUsername || filterUsername.trim() === '') && (!filterUserId || isNaN(filterUserId))) {
      return users;
    }

    const lowerCaseFilterText = filterUsername ? filterUsername.toLowerCase() : '';

    return users.filter(user => {
      const userIdMatch = filterUserId !== null ? user.user_id === filterUserId : true;
      const usernameMatch = filterUsername ? user.username.toLowerCase().includes(lowerCaseFilterText) : true;
      return userIdMatch && usernameMatch;
    });
  }

}
