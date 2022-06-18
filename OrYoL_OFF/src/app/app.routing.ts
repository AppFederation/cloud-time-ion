import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
const appRoutes: Routes = [
  {
    path: 'sign-in',
    loadChildren: () => import('app/user-sign-in/user-sign-in.module').then(m => m.UserSignInModule)
  },
  {
    path: 'tree',
    loadChildren: () => import('app/tree-page/tree-page.module').then(m => m.TreePageModule)
  },
  {
    path: 'moderation',
    loadChildren: () => import('app/apps/ModerationTimers/moderation-timers-page/moderation-timers-page.module').then(m => m.ModerationTimersPageModule)
  },
  {
    path: '',
    redirectTo: 'tree',
    pathMatch: 'full',
    //   canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];

export const routingModule = RouterModule.forRoot(
  appRoutes,
  {
    // preloadingStrategy: PreloadAllModules, // causes "TypeError: undefined is not a function"
    // useHash: true,
  }
);
