import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebugService } from './debug.service'
import { CommandsService } from './commands.service'
import { ClipboardService } from './clipboard.service'
import {DbFirestoreModule} from '../db-firestore/db-firestore.module'
import {TreeModelModule} from '../tree-model/tree-model.module'

@NgModule({
  imports: [
    CommonModule,
    TreeModelModule,
    DbFirestoreModule,
  ],
  declarations: [],
  providers: [
    DebugService,
    CommandsService,
    ClipboardService,
    // navigation service
    // dialog service
  ]
})
export class CoreModule { }
