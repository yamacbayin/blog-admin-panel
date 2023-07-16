import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserDto } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';

/**
 * Component for creating a new user.
 */
@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnDestroy {

  private createUserSubscription: Subscription;

  constructor(
    private router: Router,
    private userService: UserService) {

    /**
     * Subscription to handle the response of the create user request.
     * If response is 200, redirects to the detail of newly created user.
     */
    this.createUserSubscription = this.userService.backendPostResponse$.subscribe(
      {
        next: (response: UserDto) => {
          this.router.navigateByUrl('/users/' + response.user_id);
        }
      }
    );

  }

  onCreateUser(user: UserDto) {
    this.userService.createUser(user);
  }

  ngOnDestroy() {
    if (this.createUserSubscription) {
      this.createUserSubscription.unsubscribe();
    }
  }
}


