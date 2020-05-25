import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '',
    loadChildren: './tabs/tabs.module#TabsPageModule' },

  { path: 'journal/write',
    loadChildren: './apps/Journal/journal-write-page/journal-write.page.module#JournalWritePageModule' },
  { path: 'journal/charts',
    loadChildren: './apps/Journal/journal-charts/journal-charts.module#JournalChartsPageModule' },

  { path: 'TopicFriends',
    loadChildren: './apps/TopicFriends/topic-friends.module#TopicFriendsModule' },
  { path: 'auth',
    loadChildren: './auth/auth.module#AuthPageModule' },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
