import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OdmListComponent} from "./odm-list/odm-list.component";


const exports = [
  OdmListComponent
];

@NgModule({
  declarations: [
    ...exports,
  ],
  exports: exports,
  imports: [
    CommonModule,
  ]
})
export class OdmUiModule { }
