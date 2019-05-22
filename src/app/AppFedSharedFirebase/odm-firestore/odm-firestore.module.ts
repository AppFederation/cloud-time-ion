import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AngularFireModule} from "@angular/fire";
import {firebaseConfig} from "../../firebase.config";
import {AngularFireDatabaseModule} from "@angular/fire/database";
import {AngularFirestoreModule} from "@angular/fire/firestore";
import {OdmModule} from "../../AppFedShared/odm/odm.module";
import {FirestoreOdmBackend} from "./firestore-odm-backend.service";
import {OdmBackend} from "../../AppFedShared/odm/OdmBackend";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    OdmModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
  ],
  providers: [
    {provide: OdmBackend, useClass: FirestoreOdmBackend},
  ],
  exports: [
    OdmModule,
  ]
})
export class OdmFirestoreModule { }
