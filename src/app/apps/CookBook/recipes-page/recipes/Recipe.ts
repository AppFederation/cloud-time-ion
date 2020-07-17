import {OdmItem} from "../../../../libs/AppFedShared/odm/OdmItem";
import {TimeDuration} from "../../../../libs/AppFedShared/time/TimeDuration";

export class Recipe extends OdmItem<Recipe> {

  title ? : string
  preparationDuration ? : TimeDuration // DurationSeconds / Ms better
  isVegetarian ? : boolean
  isVegan ? : boolean
  isGlutenFree ? : boolean

}
