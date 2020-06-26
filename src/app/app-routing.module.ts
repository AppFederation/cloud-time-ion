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
  { path: 'learn',
    loadChildren: './apps/Learn/search-or-add-learnable-item/search-or-add-learnable-item.module#SearchOrAddLearnableItemPageModule',
    data: { shouldReuse: true },
  },
  { path: 'learn/item',
    loadChildren: './apps/Learn/learn-item-details/learn-item-details.module#LearnItemDetailsPageModule'
  },
  { path: 'learn/quiz',
    loadChildren: './apps/Learn/quiz/quiz.module#QuizPageModule'
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
