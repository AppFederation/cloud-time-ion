import {NgModule} from "@angular/core";
import {AppComponent} from "../app.component";
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
