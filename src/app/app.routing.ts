import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
const appRoutes: Routes = [
  {
    path: 'tree',
    loadChildren: 'app/tree-page/tree-page.module#TreePageModule'
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
