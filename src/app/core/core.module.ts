import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebugService } from './debug.service'
import { CommandsService } from './commands.service'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    DebugService,
    CommandsService,
  ]
})
export class CoreModule { }
