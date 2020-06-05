import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModerationTimersPageComponent } from './moderation-timers-page.component'

const routes: Routes = [
  {
    path: '',
    component: ModerationTimersPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModerationTimersPageRoutingModule { }
