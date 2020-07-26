import {AbstractControl, FormControl, FormGroup} from '@angular/forms'
import {OdmItem$2} from '../OdmItem$2'

export class ViewSyncer<TKey = string, TValue = any /* TODO */> {

  public initialDataArrived = false
  public isApplyingFromDb = false

  // mapKeyToLastEditTime = new Map<TKey, number>()

  lastLocalEditByUserMs = 0

  MIN_INTERVAL_MS = 5_000

  constructor(
    /** TODO make it FormControl in maybe ViewSyncer2 coz needs individual updates */
    private formGroup: AbstractControl,
    private item$: OdmItem$2<any, any, any, any>,
  ) {
    // console.log('ViewSyncer ctor', item$, item$.id)
    this.item$.locallyVisibleChanges$.subscribe((dataFromDb: any) => {
      // console.log(`ViewSyncer locallyVisibleChanges$`, this.item$.id, dataFromDb)
      // this.formGroup.setValue(data) // FIXME: use setValue in case some field externally deleted, but need to fill missing fields using new util func ensureFieldsExistBasedOn
      // if ( ! this.initialDataArrived /* prevent self-overwrite; later could do smth like in OrYoL - minimum time delay from last edit, some seconds or even minutes*/ ) {
      if ( this.hasEnoughTimePassedFromLastUserEditToApplyFromDb() ) {
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
        this.lastLocalEditByUserMs = Date.now()
        this.item$.patchThrottled(newValue) // TODO: patchThrottled({cleanUp: true}) -- trim to null; maybe remove unused fields to save bytes and not put `null`
      }
    })

  }

  getLastEditTimeForField(field: TKey): number {
    return this.lastLocalEditByUserMs
  }

  /* To prevent incoming changes overwriting user edit */
  private hasEnoughTimePassedFromLastUserEditToApplyFromDb() {
    return (Date.now() - this.lastLocalEditByUserMs) > this.MIN_INTERVAL_MS
  }
}
