import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post';
import { PostService } from '../post-service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth-service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  isLoading = false;
  private subscription: Subscription;
  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.subscription = this.postService
      .getPostUpdateListener()
      .subscribe(postsData => {
        this.posts = postsData.posts;
        this.totalPosts = postsData.maxPosts;
        this.isLoading = false;
      });
  }

  onPageChanged(event: PageEvent) {
    this.isLoading = true;
    this.currentPage = event.pageIndex + 1;
    this.postsPerPage = event.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }
  onDeletePost(id: string) {
    this.isLoading = true;
    this.postService.deletePost(id).subscribe(
      () => {
        this.postService.getPosts(this.postsPerPage, this.currentPage);
        this.isLoading = false;
      },
      err => (this.isLoading = false)
    );
  }
  isUserLoggedIn() {
    return this.authService.isUserLoggedIn();
  }
  get userId() {
    if (this.authService.decodedToken) {
      return this.authService.decodedToken.userId;
    }
    return null;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
