import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NumericPickerComponent} from './numeric-picker/numeric-picker.component'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {IonicModule} from '@ionic/angular'

const exports = [
  NumericPickerComponent,
]

@NgModule({
  declarations: [
    ...exports
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
  ],
  exports: exports
})
export class RatingsModule { }
