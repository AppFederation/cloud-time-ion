import {OdmItem__OLD__} from "../../../../libs/AppFedShared/odm/OdmItem__OLD__";
import {TimeMsDuration} from "../../../../libs/AppFedShared/time/TimeMsDuration";

export class Recipe extends OdmItem__OLD__<Recipe> {

  title ? : string
  preparationDuration ? : TimeMsDuration // DurationSeconds / Ms better
  isVegetarian ? : boolean
  isVegan ? : boolean
  isGlutenFree ? : boolean

}
