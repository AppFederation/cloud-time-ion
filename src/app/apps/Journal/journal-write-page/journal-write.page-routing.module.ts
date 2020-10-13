import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {JournalWritePage} from "./journal-write.page";

const routes: Routes = [
  // {
  //   // path: ':journalEntryId',
  //   path: 'new' /* not param yet to not lose content on switching routes */,
  //   component: JournalWritePage,
  // },
  {
    // path: ':journalEntryId',
    path: ':itemId',
    component: JournalWritePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JournalWritePageRoutingModule { }
