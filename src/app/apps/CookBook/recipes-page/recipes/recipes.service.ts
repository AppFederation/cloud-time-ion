import {Injectable, Injector} from '@angular/core';
import {OdmService_OLD} from "../../../../libs/AppFedShared/odm/OdmService_OLD";
import {Recipe} from "./Recipe";

@Injectable({
  providedIn: 'root'
})
export class RecipesService extends OdmService_OLD<Recipe> {

  constructor(
    injector: Injector,
  ) {
    super(
      injector,
      'Recipe'
    )
  }
}
