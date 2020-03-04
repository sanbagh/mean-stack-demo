import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl + 'user';
  private jwtHelper = new JwtHelperService();
  private authStatusListener = new Subject<boolean>();
  decodedToken;
  constructor(private httpService: HttpClient, private router: Router) {}
  createUser(authData: AuthData) {
    this.httpService.post(this.baseUrl + '/signup', authData).subscribe(() => {
      this.router.navigate(['/']);
    }, err => {
      this.authStatusListener.next(false);
    });
  }
  login(authData: AuthData) {
    this.httpService
      .post(this.baseUrl + '/login', authData)
      .subscribe((tokenData: any) => {
        this.decodedToken = this.jwtHelper.decodeToken(tokenData.token);
        localStorage.setItem('token', tokenData.token);
        this.router.navigate(['/']);
      }, err => {
        this.authStatusListener.next(false);
      });
  }
  logOut() {
    localStorage.removeItem('token');
  }
  isUserLoggedIn() {
    const token  = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    const isExpired = this.jwtHelper.isTokenExpired(token);
    if (isExpired) {
      this.logOut();
      this.router.navigate(['/']);
    }
    return !isExpired;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
}
