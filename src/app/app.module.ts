import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {TreeDragDropService, TreeModule} from 'primeng/primeng'
import {HttpModule} from '@angular/http'
import {FirestoreTreeService} from './shared/firestore-tree.service';
import { TestFirestoreComponent } from './test-firestore/test-firestore.component';
import { NodeContentComponent } from './tree/node-content/node-content.component'
import {RouterModule, Routes} from '@angular/router';
import { TreeHostComponent } from './tree/tree-host/tree-host.component'
import {TreeService} from './shared/tree.service'
import {MatIconModule} from '@angular/material';
import { TestPermissionsAndFiltersComponent } from './test-permissions-and-filters/test-permissions-and-filters.component'
import {DbTreeService} from './shared/db-tree-service'
import {FormsModule} from '@angular/forms';
import { ConfirmModalComponent } from './shared/confirm-modal/confirm-modal.component'
import { DialogService } from './core/dialog.service';
import { NestedTreeComponent } from './nested-tree/nested-tree.component';
import { NestedTreeNodeComponent } from './nested-tree-node/nested-tree-node.component'

const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tree',
  },
  {
    path: 'tree',
    component: TreeHostComponent,
  },
  {
    path: 'test-firestore',
    component: TestFirestoreComponent,
  },
  {
    path: 'test-perm-fil',
    component: TestPermissionsAndFiltersComponent,
  },
  {
    path: '**',
    redirectTo: 'tree',
  },

];


@NgModule({
  declarations: [
    AppComponent,
    TestFirestoreComponent,
    NodeContentComponent,
    TreeHostComponent,
    TestPermissionsAndFiltersComponent,
    ConfirmModalComponent,
    NestedTreeComponent,
    NestedTreeNodeComponent
  ],
  imports: [
    BrowserModule,
    TreeModule,
    HttpModule,
    FormsModule,
    // MatIconModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    TreeDragDropService,
    {provide: DbTreeService, useClass: FirestoreTreeService},
    TreeService,
    DialogService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
