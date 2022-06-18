import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search/search.component';
import { FormsModule } from '@angular/forms';
import { SearchResultRowComponent } from './search/search-result-row/search-result-row.component'
import { TreeSharedModule } from '../tree-shared/tree-shared.module'

@NgModule({
  declarations: [
    SearchComponent,
    SearchResultRowComponent
  ],
  exports: [
    SearchComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TreeSharedModule,
  ],
})
export class SearchModule { }
