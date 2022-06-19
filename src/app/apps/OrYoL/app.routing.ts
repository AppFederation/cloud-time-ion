// import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
// const appRoutes: Routes = [
//   {
//     path: 'sign-in',
//     loadChildren: () => import('src/app/apps/OrYoL/user-sign-in/user-sign-in.module').then(m => m.UserSignInModule)
//   },
//   {
//     path: 'tree',
//     loadChildren: () => import('src/app/apps/OrYoL/tree-page/tree-page.module').then(m => m.TreePageModule)
//   },
//   {
//     path: 'moderation',
//     loadChildren: () => import('src/app/apps/OrYoL/apps/ModerationTimers/moderation-timers-page/moderation-timers-page.module').then(m => m.ModerationTimersPageModule)
//   },
//   {
//     path: '',
//     redirectTo: 'tree',
//     pathMatch: 'full',
//     //   canActivate: [AuthGuard]
//   },
//   { path: '**', redirectTo: '' }
// ];
//
// export const routingModule = RouterModule.forRoot(
//   appRoutes,
//   {
//     // preloadingStrategy: PreloadAllModules, // causes "TypeError: undefined is not a function"
//     // useHash: true,
//   }
// );
