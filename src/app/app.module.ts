import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {TreeDragDropService, TreeModule} from 'primeng/primeng'
import {NodesService} from './nodes.service'
import {HttpModule} from '@angular/http'
import {DbService} from './db.service';
import { TestFirestoreComponent } from './test-firestore/test-firestore.component';
import { NodeContentComponent } from './node-content/node-content.component'

@NgModule({
  declarations: [
    AppComponent,
    TestFirestoreComponent,
    NodeContentComponent
  ],
  imports: [
    BrowserModule,
    TreeModule,
    HttpModule,
  ],
  providers: [
    NodesService,
    TreeDragDropService,
    DbService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
