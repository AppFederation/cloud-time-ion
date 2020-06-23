import {FormGroup} from '@angular/forms'
import {OdmItem$2} from '../../../libs/AppFedShared/odm/OdmItem$2'

export class ViewSyncer {
  public initialDataArrived = false
  public isApplyingFromDb = false

  constructor(
    private formGroup: FormGroup,
    private item$: OdmItem$2<any>,
  ) {
    console.log('ViewSyncer ctor', item$, item$.id)
    this.item$.locallyVisibleChanges$.subscribe(dataFromDb => {
      console.log(`locallyVisibleChanges$`, this.item$.id, dataFromDb)
      // this.formGroup.setValue(data) // FIXME: use setValue in case some field externally deleted, but need to fill missing fields using new util func ensureFieldsExistBasedOn
      if ( ! this.initialDataArrived /* prevent self-overwrite; later could do smth like in OrYoL - minimum time delay from last edit, some seconds or even minutes*/ ) {
        if ( dataFromDb ) {
          this.initialDataArrived = true
        }
        try {
          this.isApplyingFromDb = true
          this.formGroup.patchValue(dataFromDb)
        } finally {
          this.isApplyingFromDb = false
        }
      }
    })
    this.formGroup.valueChanges.subscribe(newValue => {
      if ( ! this.isApplyingFromDb ) {
        this.item$.patchThrottled(newValue)
      }
    })

  }

}
