import {AbstractControl, FormControl, FormGroup} from '@angular/forms'
import {OdmItem$2} from '../OdmItem$2'
import {debugLog} from '../../utils/log'
import {LearnItem$} from '../../../../apps/Learn/models/LearnItem$'

export class ViewSyncer<TKey = string, TValue = any /* TODO */, TItemInMem = any> {

  private initialDataArrivalWasSetExplicitly = false
  public initialDataArrived = false
  public isApplyingFromDb = false

  // mapKeyToLastEditTime = new Map<TKey, number>()

  lastLocalEditByUserMs = 0

  MIN_INTERVAL_MS = 5_000

  constructor(
    /** TODO make it FormControl in maybe ViewSyncer2 coz needs individual updates */
    public formGroup: AbstractControl,
    public item$: OdmItem$2<any, TItemInMem, any, any>,
    public requireExplicitInitialValueTrigger ? : boolean)
  {
    // console.log('ViewSyncer ctor', item$, item$.id)
    this.item$.locallyVisibleChanges$.subscribe((dataFromDb: TItemInMem | undefined | null) => {

      // console.log(`ViewSyncer locallyVisibleChanges$`, this.item$.id, dataFromDb)
      // this.formGroup.setValue(data) // FIXME: use setValue in case some field externally deleted, but need to fill missing fields using new util func ensureFieldsExistBasedOn
      // if ( ! this.initialDataArrived /* prevent self-overwrite; later could do smth like in OrYoL - minimum time delay from last edit, some seconds or even minutes*/ ) {
      if ( this.hasEnoughTimePassedFromLastUserEditToApplyFromDb() ) {
        if ( dataFromDb ) {
          debugLog('ViewSyncer - item$.locallyVisibleChanges$.subscribe -- initialDataArrived = true', dataFromDb)
          this.initialDataArrived = true
        }
        try {
          this.isApplyingFromDb = true
          this.formGroup.patchValue(dataFromDb) // TODO: handle nullish
        } finally {
          this.isApplyingFromDb = false
        }
      }
    })
    this.formGroup.valueChanges.subscribe(newValue => {
      if ( this.requireExplicitInitialValueTrigger && ! this.initialDataArrivalWasSetExplicitly ) {
        return
      }
      debugLog(`this.formGroup.valueChanges.subscribe`, newValue, `isApplyingFromDb:`, this.isApplyingFromDb)
      // todo: check if self-patch pending ; or check timestamp difference ~500 ms or if value differed (though if it is converted to html, it will differ)
      if ( ! this.isApplyingFromDb && this.initialDataArrived ) {
        this.lastLocalEditByUserMs = Date.now()
        debugLog('ViewSyncer - patchThrottled', newValue)
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

  onInitialDataWasSet() {
    this.initialDataArrivalWasSetExplicitly = true
  }
}
