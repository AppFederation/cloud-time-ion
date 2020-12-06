import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ImportanceEditComponent} from './importance-edit/importance-edit.component'
import {SharedModule} from '../../../shared/shared.module'
import {RatingsModule} from '../../AppFedSharedIonic/ratings/ratings.module'

const exports = [
  ImportanceEditComponent
]

@NgModule({
  declarations: [
    ... exports,
  ],
  exports: [
    ...exports,
    SharedModule,
    RatingsModule,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RatingsModule,
  ]
})
export class EditSharedModule { }
