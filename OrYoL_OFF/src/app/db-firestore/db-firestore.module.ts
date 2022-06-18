import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FirestoreTreeService} from './firestore-tree.service'
import {DbTreeService} from '../tree-model/db-tree-service'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,

  ],
  providers: [
    {provide: DbTreeService, useClass: FirestoreTreeService},
  ]
})
export class DbFirestoreModule { }
