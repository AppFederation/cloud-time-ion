import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: ':meetingId',
    loadChildren: './meeting-details-page/meeting-details-page.module#MeetingDetailsPageModule' },
  { path: '',
    loadChildren: './meetings-list/meetings-list.module#MeetingsListModule' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingsRoutingModule { }
