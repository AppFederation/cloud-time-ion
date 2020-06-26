import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";

let imports = [
  ReactiveFormsModule,
  FormsModule,
];

@NgModule({
  entryComponents: [],
  imports: [
    IonicModule.forRoot(),
    ...imports,
  ],
  exports: imports,
  providers: [],
})
export class SharedModule {
}
