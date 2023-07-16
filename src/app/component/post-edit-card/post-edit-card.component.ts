import { Component, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { CategorySelect } from 'src/app/model/category';
import { PostDto } from 'src/app/model/post';
import { UserSelect } from 'src/app/model/user';
import { MediatorService } from 'src/app/service/mediator.service';
import { MAT_DATE_LOCALE } from '@angular/material/core'

/**
 * Edit Card Component
 * 
 * The Edit Card Component allows users to view and modify various inputs of a post or comment. 
 * It offers select options for editing specific fields, 
 * providing a convenient way to update the content.
 * 
 * For more detailed explanations, @see {UserEditCardComponent}.
 * 
 * Post Edit Card Component supports the ability to select and modify specific inputs, 
 * enhancing the user experience and streamlining the editing process.
 * 
 */
@Component({
  selector: 'app-post-edit-card',
  templateUrl: './post-edit-card.component.html',
  styleUrls: ['./post-edit-card.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class PostEditCardComponent implements OnChanges {

  @Input() selectedPost: PostDto | undefined = undefined;
  @Input() createMode: boolean = false;
  @Input() detailsMode: boolean = false;
  @Output() persistPost = new EventEmitter<PostDto>();
  @Output() deletePost = new EventEmitter<PostDto>();

  editMode: boolean = false;
  editedPost!: PostDto;

  selectUserOptions: UserSelect[] = [];
  selectCategoryOptions: CategorySelect[] = [];

  author!: UserSelect;
  category!: CategorySelect;

  pickedDate: Date | null = null;
  pickedTime: string | null = null;

  /**
   * Constructs the PostEditCardComponent.
   * 
   * @param mediatorService The mediator service for retrieving select options.
   */
  constructor(private mediatorService: MediatorService) {

  }

  ngOnInit(): void {
    if (this.createMode) {
      this.initializeCreateMode();
    }
  }

  /**
   * Observes changes to the selectedPost input.
   * Updates the component's state accordingly.
   * 
   * @param changes The changes detected in the input properties.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPost'] && changes['selectedPost'].currentValue) {
      this.editMode = false;
      this.initializeEditedPost();
      const parts = this.selectedPost?.creation_date.split('T');
      this.pickedDate = new Date(parts![0]);
      const timeParts = parts![1].split(':');
      this.pickedTime = timeParts[0] + ':' + timeParts[1];
    }
  }

  toggleEditMode() {
    if (this.editMode) {
      this.initializeEditedPost();
    }
    this.editMode = !this.editMode;
  }

  onSaveOrUpdateClick() {
    this.editedPost.user_id = this.author.user_id;
    this.editedPost.username = this.author.username;
    this.editedPost.category_id = this.category.category_id;
    this.editedPost.category_name = this.category.name;
    this.persistPost.emit(this.editedPost);
  }

  onDeletePost(): void {
    let text = "Are you sure about deleting the post " + this.selectedPost?.title + "?";
    if (confirm(text) == true) {
      this.deletePost.emit(this.selectedPost);
    }
  }

  onDateChange() {
    this.formatSelectedTime();
  }

  /**
   * Fetches all available options for users and categories from the mediator service.
   */
  private fetchOptions() {
    this.selectUserOptions = this.mediatorService.getSelectUserOptions();
    this.selectCategoryOptions = this.mediatorService.getSelectCategoryOptions();

    this.author = this.selectUserOptions[0];
    this.category = this.selectCategoryOptions[0];
  }


  /**
   * Initializes the edited post data based on the selected post.
   * Fetches the available options for users and categories.
   * Sets the default values for the author and category fields.
   */
  private initializeEditedPost() {
    this.fetchOptions();
    const userIndex = this.selectUserOptions.findIndex(userOption =>
      userOption.user_id === this.selectedPost?.user_id);
    this.author = this.selectUserOptions[userIndex];
    const categoryIndex = this.selectCategoryOptions.findIndex(categoryOption =>
      categoryOption.category_id === this.selectedPost?.category_id);
    this.category = this.selectCategoryOptions[categoryIndex];

    this.editedPost = {
      post_id: this.selectedPost?.post_id ?? 0,
      user_id: this.selectedPost?.user_id ?? 0,
      category_id: this.selectedPost?.category_id ?? 0,
      title: this.selectedPost?.title ?? "",
      content: this.selectedPost?.content ?? "",
      view_count: this.selectedPost?.view_count ?? 0,
      creation_date: this.selectedPost?.creation_date ?? "",
      is_published: this.selectedPost?.is_published ?? false,
      username: this.selectedPost?.username ?? "",
      category_name: this.selectedPost?.category_name ?? "",
      comment_count: this.selectedPost?.comment_count ?? 0
    };
  }

  private initializeCreateMode() {
    this.fetchOptions();
    this.editedPost = {
      post_id: 0,
      user_id: 0,
      category_id: 0,
      title: "",
      content: "",
      view_count: 0,
      creation_date: "",
      is_published: false,
      username: "",
      category_name: "",
      comment_count: 0
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
    this.editedPost.creation_date = finalDateTime;
  }
}
