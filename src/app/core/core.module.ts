import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebugService } from './debug.service'
import { CommandsService } from './commands.service'
import { ClipboardService } from './clipboard.service'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    DebugService,
    CommandsService,
    ClipboardService,
    // navigation service
    // dialog service
  ]
})
export class CoreModule { }
