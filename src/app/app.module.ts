import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {TreeDragDropService, TreeModule} from 'primeng/primeng'
import {NodesService} from './nodes.service'
import {HttpModule} from '@angular/http'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TreeModule,
    HttpModule,
  ],
  providers: [
    NodesService,
    TreeDragDropService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
