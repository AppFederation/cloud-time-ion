import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TreeService} from './tree.service'

/** Tree-model and related.
 * That is, non-UI related and non-Firestore related.
 * Later might split into:
 * - tree model itself
 * - db tree vs db/sync
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    TreeService,
  ]
})
export class TreeModelModule { }
