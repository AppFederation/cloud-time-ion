import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // { path: ':meetingId',
  //   loadChildren: () => import('./meeting-details-page/meeting-details-page.module').then(m => m.MeetingDetailsPageModule) },
  { path: '',
    loadChildren: () => import('./meetings-list/meetings-list.module').then(m => m.MeetingsListModule) },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingsRoutingModule { }
