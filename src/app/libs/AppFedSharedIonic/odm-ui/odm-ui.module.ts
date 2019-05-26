import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OdmListComponent} from "./odm-list/odm-list.component";
import { OdmListItemDirective } from './odm-list/odm-list-item.directive';
import {OdmListPageComponent} from "./odm-list-page/odm-list-page.component";
import {IonicModule} from "@ionic/angular";


const exports = [
  OdmListComponent,
  OdmListItemDirective,
  OdmListPageComponent,
];

@NgModule({
  declarations: [
    ...exports,
    OdmListItemDirective,
  ],
  exports: exports,
  imports: [
    CommonModule,
    IonicModule.forRoot(),
  ]
})
export class OdmUiModule { }
