import {Injectable, Injector} from '@angular/core';
import {OdmCollectionService2} from '../../../../libs/AppFedShared/odm/v2/OdmCollectionService2'
import {FieldDefNumeric} from '../../models/FieldDefNumeric'

@Injectable({
  providedIn: 'root'
})
export class FieldDefNumericService extends OdmCollectionService2<FieldDefNumeric> {

  constructor(
    injector: Injector
  ) {
    super(injector, 'FieldDefNumeric')
  }
}
