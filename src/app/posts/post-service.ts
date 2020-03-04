import { Injectable } from '@angular/core';
import { Post } from './post';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postUpdated = new Subject<{ posts: Post[]; maxPosts: number }>();
  private errorNotifier = new Subject<boolean>();
  private posts: Post[] = [];
  private baseUrl = environment.apiUrl;
  constructor(private httpService: HttpClient, private router: Router) {}
  getPosts(pageSize: number, page: number) {
    const queryParams = `?pageSize=${pageSize}&page=${page}`;
    this.httpService
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.baseUrl + 'posts/' + queryParams
      )
      .pipe(
        map(res => {
          return { posts: res.posts.map(post => ({
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            })), maxPosts: res.maxPosts };
        })
      )
      .subscribe(posts => {
        this.posts = posts.posts;
        this.postUpdated.next({
          posts: [...this.posts],
          maxPosts: posts.maxPosts
        });
      });
  }
  getPost(postId: string) {
    return this.httpService.get(this.baseUrl + 'posts/' + postId);
  }
  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }
  getErrorNotifierListener() {
    return this.errorNotifier.asObservable();
  }
  addPost(title: string, content: string, image: File) {
    const post = new FormData();
    post.append('title', title);
    post.append('content', content);
    post.append('image', image, title);
    this.httpService
      .post<{ message: string; post: Post }>(this.baseUrl + 'posts/', post)
      .subscribe(postData => {
        this.router.navigate(['/']);
      }, err => this.errorNotifier.next(false));
  }
  updatePost(post: Post) {
    let postData: Post | FormData;
    if (typeof post.imagePath === 'object') {
      postData = new FormData();
      postData.append('id', post.id);
      postData.append('title', post.title);
      postData.append('content', post.content);
      postData.append('image', post.imagePath, post.title);
      postData.append('creator', null);
    } else {
      postData = Object.assign({}, post);
    }
    this.httpService
      .put(this.baseUrl + 'posts/' + post.id, postData)
      .subscribe(() => {
        this.router.navigate(['/']);
      }, err => this.errorNotifier.next(false));
  }
  deletePost(id: string) {
    return this.httpService.delete(this.baseUrl + 'posts/' + id);
  }
}
