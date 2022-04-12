import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OdmListComponent} from "./odm-list/odm-list.component";
import { OdmListItemDirective } from './odm-list/odm-list-item.directive';
import {OdmListPageComponent} from "./odm-list-page/odm-list-page.component";
import {IonicModule} from "@ionic/angular";
import {OdmCheckbox} from './bound-checkbox/odm-checkbox'
import {ReactiveFormsModule} from '@angular/forms'


const exports = [
  OdmListComponent,
  OdmListItemDirective,
  OdmListPageComponent,
  OdmCheckbox,
];

@NgModule({
  declarations: [
    ...exports,
    OdmListItemDirective,
  ],
  exports: exports,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
  ],
})
export class OdmUiModule { }
