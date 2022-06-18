import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TreePageComponent} from './tree-page/tree-page.component'

const routes: Routes = [
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   redirectTo: 'tree',
  // },
  {
    path: ':rootNodeId',
    component: TreePageComponent,
  },
  {
    path: '',
    component: TreePageComponent,
  },
  // {
  //   path: 'test-firestore',
  //   component: TestFirestoreComponent,
  // },
  // {
  //   path: 'test-perm-fil',
  // component: TestPermissionsAndFiltersComponent,
  // },
  {
    path: '**',
    redirectTo: 'tree',
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TreePageRoutingModule { }
