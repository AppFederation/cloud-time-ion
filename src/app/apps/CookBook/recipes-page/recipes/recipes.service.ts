import {Injectable, Injector} from '@angular/core';
import {OdmService} from "../../../../libs/AppFedShared/odm/OdmService";
import {Recipe} from "./Recipe";

@Injectable({
  providedIn: 'root'
})
export class RecipesService extends OdmService<Recipe> {

  constructor(
    injector: Injector,
  ) {
    super(
      injector,
      'Recipe'
    )
  }
}
