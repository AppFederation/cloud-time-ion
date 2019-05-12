import {NgModule} from "@angular/core";
import {AppComponent} from "../app.component";
import {ReactiveFormsModule} from "@angular/forms";

let imports = [
    ReactiveFormsModule,
];

@NgModule({
    entryComponents: [],
    imports: imports,
    exports: imports,
    providers: [
    ],
})
export class SharedModule {}
