import { PostsService } from './../posts.service';
import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Post } from './../post.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  titleError = ""
  contentError = ""
  //@Output() postCreated = new EventEmitter<Post>();
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private node = 'create';
  private postId: string;
  public post: Post;//does not need to say new post or check for undefined in the html, just add question mark in html
  private authStatusSub: Subscription;

  constructor(public postsService: PostsService, public route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(10)]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.node = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });//adding by angular http client so we do not need to unsubscribe, because angular takes care about it
      } else {
        this.node = 'create';
        this.postId = null;
      }
    });//it is an observable, the parameter on the url could change, load teh same angualr component for a different postId
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });//patch a single control, file is not text, is an object
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {//async code, will take a while
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.node === 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    if (!this.getTitleErrorMsg() && !this.getContentErrorMsg()) {
      this.form.reset();
    }
  }

  getTitleErrorMsg() {
    var postTitle = this.form.value.title;
    if (postTitle != null) {
      if (postTitle.length == 0) {
        return "Please enter a post title"
      }
      if (postTitle.length > 0 && postTitle.length < 3) {
        return "Post title must be greater than 3 characters"
      }
    }
  }

  // getTitleErrorMsg(form: NgForm) {
  //   var postTitle = form.value.title;
  //   if (postTitle != null) {
  //     if (postTitle.length == 0) {
  //       return "Please enter a post title"
  //     }
  //     if (postTitle.length > 0 && postTitle.length < 3) {
  //       return "Post title must be greater than 3 characters"
  //     }
  //   }
  // }

  getContentErrorMsg() {
    var postContent = this.form.value.content;
    if (postContent != null) {
      if (postContent.length == 0) {
        return "Please enter a post title"
      }
      if (postContent.length > 0 && postContent.length < 10) {
        return "Post title must be greater than 10 characters"
      }
    }
  }

  // getContentErrorMsg(form: NgForm) {
  //   var postContent = form.value.content;
  //   if (postContent != null) {
  //     if (postContent.length == 0) {
  //       return "Please enter a post title"
  //     }
  //     if (postContent.length > 0 && postContent.length < 10) {
  //       return "Post title must be greater than 10 characters"
  //     }
  //   }
  // }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
