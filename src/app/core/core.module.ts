import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebugService } from './debug.service'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    DebugService,
  ]
})
export class CoreModule { }
