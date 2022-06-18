import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserSignInComponent } from './user-sign-in/user-sign-in.component'

const routes: Routes = [
  {
    path: '',
    component: UserSignInComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSignInRoutingModule { }
