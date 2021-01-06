import { PostsService } from './../posts.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from './../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  titleError = ""
  contentError = ""
  //@Output() postCreated = new EventEmitter<Post>();

  constructor(public postsService: PostsService) { }

  ngOnInit() {
  }

  onAddPost(form: NgForm){
    if(form.invalid){
      return
    }
    this.postsService.addPost(form.value.title, form.value.content);
    if(!this.getTitleErrorMsg(form) && !this.getContentErrorMsg(form))
    form.resetForm();
    // const post: Post = {
    //   title: form.value.title,
    //   content: form.value.content
    // };
    //this.postCreated.emit(post);
  }

  getTitleErrorMsg(form: NgForm){
    var postTitle = form.value.title;
    if(postTitle!=null){
      if(postTitle.length==0){
        return "Please enter a post title"
      }
      if(postTitle.length>0 && postTitle.length<3){
        return "Post title must be greater than 3 characters"
      }
    }
  }

  getContentErrorMsg(form: NgForm){
    var postContent = form.value.content;
    if(postContent!=null){
      if(postContent.length==0){
        return "Please enter a post title"
      }
      if(postContent.length>0 && postContent.length<3){
        return "Post title must be greater than 3 characters"
      }
    }
  }

}
