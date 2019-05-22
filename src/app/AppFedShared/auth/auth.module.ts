import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginViaEmailPasswordComponent} from "./login-via-email-password/login-via-email-password.component";

let exports = [
  LoginViaEmailPasswordComponent,
]

@NgModule({
  declarations: [
    ...exports,
  ],
  imports: [
    CommonModule,
  ],
  exports: exports
})
export class AuthModule { }
