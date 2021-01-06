import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'

import { Post } from './post.model';
@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor() { }

  getPosts() {
    return [...this.posts]; //Creates new array, does not take the pointer, wont affect original array
    //return this.posts;
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {title: title, content: content};
    this.posts.push(post);
    this.postsUpdated.next([...this.posts])
  }
}
