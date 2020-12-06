import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ImportanceEditComponent} from './importance-edit/importance-edit.component'
import {SharedModule} from '../../../shared/shared.module'

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
  ],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class EditSharedModule { }
