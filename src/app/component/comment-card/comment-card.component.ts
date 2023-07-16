import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommentDto } from 'src/app/model/comment';

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
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.css']
})
export class CommentCardComponent {
  @Input() comment!: CommentDto;
  @Input() detailsMode: boolean = false;
  @Output() editComment = new EventEmitter<CommentDto>();
  @Output() deleteComment = new EventEmitter<CommentDto>();

  onEditComment(): void {
    this.editComment.emit(this.comment);
  }

  onDeleteComment(): void {
    let text = 'Are you sure about deleting the user ' + this.comment.username
      + '\'s comment "' + this.comment.comment + '"?';
    if (confirm(text) == true) {
      this.deleteComment.emit(this.comment);
    }
  }

}
