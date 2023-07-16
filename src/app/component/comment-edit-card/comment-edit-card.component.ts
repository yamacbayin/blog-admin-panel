import { Component, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { UserSelect } from 'src/app/model/user';
import { PostSelect } from 'src/app/model/post';
import { MediatorService } from 'src/app/service/mediator.service';
import { CommentDto } from 'src/app/model/comment';

/**
 * Edit Card Component
 * 
 * The Edit Card Component allows users to view and modify various inputs of a post or comment. 
 * It offers select options for editing specific fields, 
 * providing a convenient way to update the content.
 * 
 * For more detailed explanations, @see {UserEditCardComponent} and @see {PostEditCardComponent}.
 * 
 * Category Edit Card Component supports the ability to select and modify specific inputs, 
 * enhancing the user experience and streamlining the editing process.
 * 
 */
@Component({
  selector: 'app-comment-edit-card',
  templateUrl: './comment-edit-card.component.html',
  styleUrls: ['./comment-edit-card.component.css']
})
export class CommentEditCardComponent {

  @Input() selectedComment: CommentDto | undefined = undefined;
  @Input() createMode: boolean = false;
  @Input() detailsMode: boolean = false;
  @Output() persistComment = new EventEmitter<CommentDto>();
  @Output() deleteComment = new EventEmitter<CommentDto>();

  editMode: boolean = false;
  editedComment!: CommentDto;

  selectUserOptions: UserSelect[] = [];
  selectPostOptions: PostSelect[] = [];

  author!: UserSelect;
  post!: PostSelect;

  pickedDate: Date | null = null;
  pickedTime: string | null = null;

  constructor(private mediatorService: MediatorService) {

  }

  ngOnInit(): void {
    if (this.createMode) {
      this.initializeCreateMode();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedComment'] && changes['selectedComment'].currentValue) {
      this.editMode = false;
      this.initializeEditedComment();

      const parts = this.editedComment?.creation_date.split('T');
      this.pickedDate = new Date(parts![0]);
      const timeParts = parts![1].split(':');
      this.pickedTime = timeParts[0] + ':' + timeParts[1];
    }
  }

  toggleEditMode() {
    if (this.editMode) {
      this.initializeEditedComment();
    }
    this.editMode = !this.editMode;
  }

  onSaveOrUpdateClick() {
    this.editedComment.user_id = this.author.user_id;
    this.editedComment.username = this.author.username;
    this.editedComment.post_id = this.post.post_id;
    this.editedComment.post_title = this.post.title;

    this.persistComment.emit(this.editedComment);
  }

  onDeleteComment(): void {
    let text = 'Are you sure about deleting the user ' + this.selectedComment?.username
      + '\'s comment "' + this.selectedComment?.comment + '"?';
    if (confirm(text) == true) {
      this.deleteComment.emit(this.selectedComment);
    }
  }

  onDateChange() {
    this.formatSelectedTime()
  }

  /**
   * Fetches the available options for users and posts.
   * Sets the default values for the author and category fields.
   */
  private fetchOptions() {
    this.selectUserOptions = this.mediatorService.getSelectUserOptions();
    this.selectPostOptions = this.mediatorService.getSelectPostOptions();
    this.author = this.selectUserOptions[0];
    this.post = this.selectPostOptions[0];
  }

  private initializeEditedComment() {
    this.fetchOptions();
    const userIndex = this.selectUserOptions.findIndex(userOption =>
      userOption.user_id === this.selectedComment?.user_id);
    this.author = this.selectUserOptions[userIndex];
    const postIndex = this.selectPostOptions.findIndex(postOption =>
      postOption.post_id === this.selectedComment?.post_id);
    this.post = this.selectPostOptions[postIndex];

    this.editedComment = {
      comment_id: this.selectedComment?.comment_id ?? 0,
      post_id: this.selectedComment?.post_id ?? 0,
      user_id: this.selectedComment?.user_id ?? 0,
      comment: this.selectedComment?.comment ?? "",
      creation_date: this.selectedComment?.creation_date ?? "",
      is_confirmed: this.selectedComment?.is_confirmed ?? false,
      username: this.selectedComment?.username ?? "",
      post_title: this.selectedComment?.post_title ?? ""
    };
  }

  private initializeCreateMode() {
    this.fetchOptions();
    this.editedComment = {
      comment_id: 0,
      post_id: 0,
      user_id: 0,
      comment: "",
      creation_date: "",
      is_confirmed: false,
      username: "",
      post_title: ""
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
    this.editedComment.creation_date = finalDateTime;
  }
}
