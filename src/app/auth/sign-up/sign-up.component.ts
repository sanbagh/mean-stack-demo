import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {
  @ViewChild('form', { static: true }) form: NgForm;
  isLoading = false;
  subscription: Subscription;
  authData: any = {};
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.subscription =  this.authService.getAuthStatusListener().subscribe(() => {
       this.isLoading = false;
     });
   }
  onSignUp() {
    this.isLoading = true;
    this.authService.createUser(this.authData);
  }

   ngOnDestroy() {
     this.subscription.unsubscribe();
   }
 
}
