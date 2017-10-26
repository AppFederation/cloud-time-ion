import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {TreeDragDropService, TreeModule} from 'primeng/primeng'
import {HttpModule} from '@angular/http'
import {DbService} from './db.service';
import { TestFirestoreComponent } from './test-firestore/test-firestore.component';
import { NodeContentComponent } from './node-content/node-content.component'
import {RouterModule, Routes} from '@angular/router';
import { TreeHostComponent } from './tree-host/tree-host.component'
import {TreeService} from './shared/tree.service'
import {FirestoreTreeService} from './shared/firestore-tree.service'

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
    path: '**',
    redirectTo: 'tree',
  },

];


@NgModule({
  declarations: [
    AppComponent,
    TestFirestoreComponent,
    NodeContentComponent,
    TreeHostComponent
  ],
  imports: [
    BrowserModule,
    TreeModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    TreeDragDropService,
    DbService,
    TreeService,
    FirestoreTreeService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
