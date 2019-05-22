import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebugService } from './debug.service'
import { CommandsService } from './commands.service'
import { ClipboardService } from './clipboard.service'
import {DbFirestoreModule} from '../db-firestore/db-firestore.module'
import {TreeModelModule} from '../tree-model/tree-model.module'
import { AuthService } from './auth.service'
import { TimeTrackingModule } from '../time-tracking/time-tracking.module'
// import { AngularFireModule } from '@angular/fire'

@NgModule({
  imports: [
    CommonModule,
    TreeModelModule,
    DbFirestoreModule,
    // AngularFireModule, // AngularFireModule.initializeApp(environment.firebase)
    TimeTrackingModule,
  ],
  declarations: [],
  providers: [
    DebugService,
    CommandsService,
    ClipboardService,
    AuthService,
    // navigation service
    // dialog service
  ]
})
export class CoreModule { }
