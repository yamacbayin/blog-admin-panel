import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PostDto } from 'src/app/model/post';
import { PostService } from 'src/app/service/post.service';

/**
 * Component for creating a new post.
 */
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnDestroy {

  private createPostSubscription: Subscription;

  constructor(
    private router: Router,
    private postService: PostService) {

    /**
     * Subscription to handle the response of the create post request.
     * If response is 200, redirects to the detail of newly created post.
     */
    this.createPostSubscription = this.postService.backendPostPutResponse$.subscribe(
      {
        next: (response: PostDto) => {
          this.router.navigateByUrl('/posts/' + response.post_id);
        }
      }
    );
  }

  onCreatePost(postDto: PostDto) {
    this.postService.createPost(postDto);
  }

  ngOnDestroy() {
    if (this.createPostSubscription) {
      this.createPostSubscription.unsubscribe();
    }
  }
}
