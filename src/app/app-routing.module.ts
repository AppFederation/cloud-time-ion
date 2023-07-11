import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/learn',
    pathMatch: 'full'
  },

  { path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },

  { path: 'journal/write',
    loadChildren: () => import('./apps/Journal/journal-write-page/journal-write.page.module').then(m => m.JournalWritePageModule) },
  { path: 'journal/entry',
    loadChildren: () => import('./apps/Journal/journal-write-page/journal-write.page.module').then(m => m.JournalWritePageModule) },
  // { path: 'journal/charts',
  //   loadChildren: () => import('./apps/Journal/journal-charts/journal-charts.module').then(m => m.JournalChartsPageModule) },
  {
    path: 'journal',
    loadChildren: () => import('./apps/Journal/journal-entries-list/journal-entries-list.module').then( m => m.JournalEntriesListPageModule)
  },


  { path: 'TopicFriends',
    loadChildren: () => import('./apps/TopicFriends/topic-friends.module').then(m => m.TopicFriendsModule) },
  { path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthPageModule) },
  { path: 'learn',
    loadChildren: () => import('./apps/Learn/search-or-add-learnable-item/search-or-add-learnable-item.module').then(m => m.SearchOrAddLearnableItemPageModule),
    data: { shouldReuse: true },
  },
  { path: 'learn/item',
    loadChildren: async () => (await import('./apps/Learn/learn-item-details/learn-item-details.module')).LearnItemDetailsPageModule
  },
  { path: 'learn/quiz',
    loadChildren: () => import('./apps/Learn/quiz/quiz.module').then(m => m.QuizPageModule)
  },
  {
    path: 'learn/stats',
    loadChildren: () => import('./apps/Learn/learn-stats/learn-stats.module').then( m => m.LearnStatsPageModule)
  },
  {
    path: 'what-next',
    loadChildren: async () => (await import('./apps/Learn/what-next/what-next.module')).WhatNextPageModule
  },
  {
    path: 'tutorial',
    loadChildren: () => import('./shared/tutorial/tutorial.module').then( m => m.TutorialPageModule)
  },
  {
    path: 'mindfulness',
    loadChildren: () => import('./apps/Mindfulness/mindfulness/mindfulness.module').then( m => m.MindfulnessPageModule)
  },
  {
    path: 'sleep',
    loadChildren: () => import('./apps/sleep/sleep.module').then( m => m.SleepPageModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./apps/Common/categories/categories.module').then( m => m.CategoriesPageModule)
  },
  {
    path: 'tree',
    loadChildren: () => import('./apps/OrYoL/tree-page/tree-page.module').then(m => m.TreePageModule)
  },
  {
    path: 'item-processing',
    loadChildren: () => import('./apps/Learn/item-processing/item-processing.module').then( m => m.ItemProcessingPageModule)
  },
  {
    path: 'success-chance',
    loadChildren: () => import('./apps/Learn/success-chance/success-chance.module').then( m => m.SuccessChancePageModule)
  },
  {
    path: 'exponential-improvement',
    loadChildren: () => import('./apps/Learn/exponential-improvement/exponential-improvement.module').then( m => m.ExponentialImprovementPageModule)
  },
  {
    path: 'categories-stats',
    loadChildren: () => import('./libs/AppFedShared/categories-stats-page/categories-stats-page.module').then( m => m.CategoriesStatsPagePageModule)
  },

  {
    path: 'lifedvisor',
    loadChildren: () => import('./apps/Lifedvisor/lifedvisor/lifedvisor.module').then(m => m.LifedvisorPageModule)
  },
  {
    path: 'ask',
    loadChildren: () => import('./apps/Lifedvisor/ask/ask.module').then(m => m.AskPageModule)
  },
  {
    path: 'life-overviews',
    loadChildren: () => import('./apps/Lifedvisor/life-overviews/life-overviews.module').then(m => m.LifeOverviewsPageModule)
  },

  { path: '**', redirectTo: '' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
