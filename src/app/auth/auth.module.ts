import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AuthPage } from './auth.page';
import { LoginEmailPasswordComponent } from './login-email-password/login-email-password.component';
import { SignupEmailPasswordComponent } from './signup-email-password/signup-email-password.component';
import { TimersPageComponent } from '../timers/timers-page.component';

const routes: Routes = [
  {
    path: '',
    component: AuthPage
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [AuthPage, LoginEmailPasswordComponent, SignupEmailPasswordComponent]
})
export class AuthPageModule {}
