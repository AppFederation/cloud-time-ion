import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeViewComponent } from './time-view/time-view.component'
import { TimePassingComponent } from './time-passing/time-passing.component'

const exports = [
  TimeViewComponent,
  TimePassingComponent,
]

@NgModule({
  declarations: exports,
  imports: [
    CommonModule
  ],
  exports: exports
})
export class TimeModule { }
