import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskNodeContentComponent } from './task-node-content/task-node-content.component';
import { TreeSharedModule } from '../tree-shared.module'

@NgModule({
  declarations: [TaskNodeContentComponent],
  imports: [
    CommonModule,
    TreeSharedModule,
  ],
})
export class TaskmgmtModule { }
