import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JournalEntriesListPage } from './journal-entries-list.page';

const routes: Routes = [
  {
    path: '',
    component: JournalEntriesListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JournalEntriesListPageRoutingModule {}
