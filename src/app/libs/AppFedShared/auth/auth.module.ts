import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginViaEmailPasswordComponent} from "./login-via-email-password/login-via-email-password.component";
import {LoginComponent} from "./login/login.component";
import {IonicModule} from "@ionic/angular";

let exports = [
  LoginViaEmailPasswordComponent,
  LoginComponent,
]

@NgModule({
  declarations: [
    ...exports,
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: exports
})
export class AuthModule { }
