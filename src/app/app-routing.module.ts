import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule) },

  { path: 'journal/write',
    loadChildren: () => import('./apps/Journal/journal-write-page/journal-write.page.module').then(m => m.JournalWritePageModule) },
  // { path: 'journal/charts',
  //   loadChildren: () => import('./apps/Journal/journal-charts/journal-charts.module').then(m => m.JournalChartsPageModule) },

  { path: 'TopicFriends',
    loadChildren: () => import('./apps/TopicFriends/topic-friends.module').then(m => m.TopicFriendsModule) },
  { path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthPageModule) },
  { path: 'learn',
    loadChildren: () => import('./apps/Learn/search-or-add-learnable-item/search-or-add-learnable-item.module').then(m => m.SearchOrAddLearnableItemPageModule),
    data: { shouldReuse: true },
  },
  { path: 'learn/item',
    loadChildren: () => import('./apps/Learn/learn-item-details/learn-item-details.module').then(m => m.LearnItemDetailsPageModule)
  },
  { path: 'learn/quiz',
    loadChildren: () => import('./apps/Learn/quiz/quiz.module').then(m => m.QuizPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
