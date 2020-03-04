import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

import { PostService } from './posts/post-service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRouterModule } from './app-router.module';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AuthService } from './auth/auth-service';
import { ErrorComponent } from './error/error.component';
import { ErrorInterceptor } from './error-interceptor';
import { AngularMaterialModule } from './angular-material.module';
import { PostModule } from './posts/posts.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRouterModule,
    PostModule,
    AngularMaterialModule,
    HttpClientModule
  ],
  providers: [PostService, AuthService,
     {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
     {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
    ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
