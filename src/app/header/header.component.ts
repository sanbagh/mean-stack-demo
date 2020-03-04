import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() { }
  isLoggedIn() {
    return this.authService.isUserLoggedIn();
  }
  onLogOut() {
    this.authService.logOut();
  }
}
