import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {JournalWritePage} from "./journal-write.page";

const routes: Routes = [
  {
    path: '', /* FIXME: hierarchical routes for journal */
    redirectTo: 'write'
  }, {
    path: 'write/:journalEntryId',
    component: JournalWritePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JournalWritePageRoutingModule { }
