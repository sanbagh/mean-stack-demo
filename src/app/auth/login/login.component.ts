import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
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
  onLogin() {
    this.isLoading = true;
    this.authService.login(this.authData);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
