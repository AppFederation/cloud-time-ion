import {OdmItem} from "../../../../libs/AppFedShared/odm/OdmItem";
import {TimeMsDuration} from "../../../../libs/AppFedShared/time/TimeMsDuration";

export class Recipe extends OdmItem<Recipe> {

  title ? : string
  preparationDuration ? : TimeMsDuration // DurationSeconds / Ms better
  isVegetarian ? : boolean
  isVegan ? : boolean
  isGlutenFree ? : boolean

}
