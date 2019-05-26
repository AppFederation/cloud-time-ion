import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OdmListComponent} from "./odm-list/odm-list.component";
import { OdmListItemDirective } from './odm-list/odm-list-item.directive';


const exports = [
  OdmListComponent,
  OdmListItemDirective,
];

@NgModule({
  declarations: [
    ...exports,
    OdmListItemDirective,
  ],
  exports: exports,
  imports: [
    CommonModule,
  ]
})
export class OdmUiModule { }
