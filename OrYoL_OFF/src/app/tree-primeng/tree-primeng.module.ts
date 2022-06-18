import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgTreeComponent } from './prime-ng-tree/prime-ng-tree.component';
import {TreeDragDropService, TreeModule} from 'primeng/primeng'
import {TreeSharedModule} from '../tree-shared/tree-shared.module'

@NgModule({
  declarations: [
    PrimeNgTreeComponent
  ],
  imports: [
    CommonModule,
    TreeModule,
    TreeSharedModule,
  ],
  exports: [
    PrimeNgTreeComponent,

  ],
  providers: [
    TreeDragDropService,
  ]
})
export class TreePrimengModule { }
