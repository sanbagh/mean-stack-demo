import { Component } from '@angular/core';
import { Post } from './posts/post';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  posts: Post[] = [];
  title = 'MEAN-STACK-DEMO';
  postCreated(post) {
    this.posts.push(post);
  }
}

