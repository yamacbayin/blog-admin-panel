import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PostDto } from 'src/app/model/post';

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
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css']
})
export class PostCardComponent {
  @Input() post!: PostDto;
  @Input() detailsMode: boolean = false;
  @Output() editPost = new EventEmitter<PostDto>();
  @Output() deletePost = new EventEmitter<PostDto>();

  onEditPost(): void {
    this.editPost.emit(this.post);
  }

  onDeletePost(): void {
    let text = "Are you sure about deleting the post " + this.post.title + "?";
    if (confirm(text) == true) {
      this.deletePost.emit(this.post);
    }
  }
}
