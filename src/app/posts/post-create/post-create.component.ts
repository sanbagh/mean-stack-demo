import {
  Component,
  OnInit,
} from '@angular/core';
import { PostService } from '../post-service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  mode = 'create';
  postId = '';
  form: FormGroup;
  imagePreview;
  isLoading = false;
  post: any = {};
  constructor(
    private postService: PostService,
    private acRoute: ActivatedRoute
  ) {}
  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ]),
      content: new FormControl('', [Validators.required]),
      image: new FormControl(null, [Validators.required], [mimeType])
    });
    this.postService.getErrorNotifierListener().subscribe(() => {
      this.isLoading = false;
    });
    this.acRoute.paramMap.subscribe(params => {
      if (params.has('id')) {
        this.mode = 'edit';
        this.postId = params.get('id');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((postData: any) => {
          this.post = {
            id: postData.post._id,
            title: postData.post.title,
            content: postData.post.content,
            imagePath: postData.post.imagePath,
            creator: postData.post.creator
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
          this.isLoading = false;
        });
      } else {
        this.mode = 'create';
        this.postId = '';
      }
    });
  }
  onSavePost() {
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.post.title = this.form.value.title;
      this.post.content = this.form.value.content;
      this.post.imagePath = this.form.value.image;
      this.postService.updatePost(this.post);
    }
    this.form.reset();
  }
  onPickedImage(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
  checkControlErrors(controlName: string) {
    const control = this.form.get(controlName);
    return control.touched && control.errors && control.invalid;
  }
  checkSpecificError(controlName: string, errorName: string) {
    const control = this.form.get(controlName);
    return control.hasError(errorName);
  }

}
