import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {TreeDragDropService, TreeModule} from 'primeng/primeng'
import {NodesService} from './nodes.service'
import {HttpModule} from '@angular/http'
import {DbService} from './db.service';
import { TestFirestoreComponent } from './test-firestore/test-firestore.component';
import { NodeContentComponent } from './node-content/node-content.component'
import {RouterModule, Routes} from '@angular/router';
import { TreeHostComponent } from './tree-host/tree-host.component'

const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'profile',
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
    redirectTo: '',
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
    NodesService,
    TreeDragDropService,
    DbService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
