import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'meetings', loadChildren: () => import('./meetings/meetings.module').then(m => m.MeetingsModule) },
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TopicFriendsRoutingModule {}
