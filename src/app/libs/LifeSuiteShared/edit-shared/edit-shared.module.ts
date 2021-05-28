import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ImportanceEditComponent} from './importance-edit/importance-edit.component'
import {SharedModule} from '../../../shared/shared.module'
import {RatingsModule} from '../../AppFedSharedIonic/ratings/ratings.module'
import {IonicModule} from '@ionic/angular'
import {FunLevelEditComponent} from './fun-level-edit/fun-level-edit.component'

const exports = [
  ImportanceEditComponent,
  FunLevelEditComponent,
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
        IonicModule,
    ],
})
export class EditSharedModule { }
