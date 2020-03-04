import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { FormsModule } from '@angular/forms';
import { AuthRouterModule } from './auth-routing.module';

@NgModule({
  declarations: [LoginComponent, SignUpComponent],
  imports: [
      CommonModule,
      AngularMaterialModule,
      FormsModule,
      AuthRouterModule
  ]
})
export class AuthModule {}
