import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {JournalWritePage} from "./journal-write.page";

const routes: Routes = [
  {
    path: ':journalEntryId',
    component: JournalWritePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JournalWritePageRoutingModule { }
