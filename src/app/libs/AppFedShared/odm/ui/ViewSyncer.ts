import {AbstractControl, FormControl, FormGroup} from '@angular/forms'
import {OdmItem$2} from '../OdmItem$2'
import {debugLog, errorAlert} from '../../utils/log'
import {LearnItem$} from '../../../../apps/Learn/models/LearnItem$'
import {DurationMs, TimeMsEpoch} from '../../utils/type-utils'
import {PatchableObservable} from '../../utils/rxUtils'
import {convertToHtmlIfNeeded} from '../../utils/html-utils'

export class ViewSyncer<TKey = string, TValue = any /* TODO */, TItemInMem = any> {

  private initialDataArrivalWasSetExplicitly = false
  public initialDataArrived = false
  public isApplyingFromDb = false

  /** FIXME: cannot compare with lastVal coz we don't know in which field component is interested */
  public lastValFromDb ? : TItemInMem | null

  // mapKeyToLastEditTime = new Map<TKey, number>()

  lastLocalEditByUserMs: TimeMsEpoch = 0 // Date.now() //0 FIXME: if zero then as if ALWAYS ENOUGH TIME PASSED ! -- need to check together with initialDataHasArrived ; maybe allow undefined here (but watch out for NaN)

  /** High number as hack for learnItem fields being overridden */
  MIN_INTERVAL_MS: DurationMs = 10_000

  constructor(
    /** TODO make it FormControl in maybe ViewSyncer2 coz needs individual updates */
    public formGroup: AbstractControl,
    public item$: PatchableObservable<TItemInMem> /*OdmItem$2<any, TItemInMem, any, any>*/,
    public requireExplicitInitialValueTrigger ? : boolean,
    /**
     * Field in which we are interested;
     * going forward, I should probably have a shared ViewSyncer and specifying field e.g. via FieldSyncer (OdmItemViewSyncer?).
     * Need to refactor to fully incremental diff patches anyway, including deep patches. And to take into account fully/partially patching FormGroup,
     * if necessary (or maybe just use FormControls always to avoid hassle with FormGroup; but to consider: whole form validation, but could be
     * independent from ViewSyncer (just grouping the FormControl-s independently from ViewSyncer / OdmFieldViewSyncer)
     * or PatchableObservableViewSyncer, to make it independent from ODM */
    public fieldNameHack ? : keyof TItemInMem)
  {
    // console.log('ViewSyncer ctor', item$, item$.id)
    this.item$.locallyVisibleChanges$.subscribe((dataFromDb: TItemInMem | undefined | null) => {

      // console.log(`ViewSyncer locallyVisibleChanges$`, this.item$.id, dataFromDb)
      // this.formGroup.setValue(data) // FIXME: use setValue in case some field externally deleted, but need to fill missing fields using new util func ensureFieldsExistBasedOn
      // if ( ! this.initialDataArrived /* prevent self-overwrite; later could do smth like in OrYoL - minimum time delay from last edit, some seconds or even minutes*/ ) {
      if ( this.shouldApplyFromDb(dataFromDb) ) {
        if ( dataFromDb ) {
          // debugLog('ViewSyncer - item$.locallyVisibleChanges$.subscribe -- initialDataArrived = true', dataFromDb)
          this.initialDataArrived = true
        }
        try {
          this.isApplyingFromDb = true
          // debugLog(`ViewSyncer this.formGroup.patchValue(dataFromDb)`, this.fieldNameHack)
          // convert plain to HTML:
          if ( this.fieldNameHack ) {
            (dataFromDb as any)[this.fieldNameHack] = convertToHtmlIfNeeded((dataFromDb as any)[this.fieldNameHack])
          }
          this.formGroup.patchValue(dataFromDb) // TODO: handle nullish
          this.lastValFromDb = dataFromDb
        } finally {
          this.isApplyingFromDb = false
        }
      }
    })
    this.formGroup.valueChanges.subscribe(newValue => {
      // errorAlert(`ViewSyncer won't save: hack for prevent rich text for now`)
      // return; // hack for prevent rich for now
      if ( this.requireExplicitInitialValueTrigger && ! this.initialDataArrivalWasSetExplicitly ) {
        return
      }
      // debugLog(`this.formGroup.valueChanges.subscribe`, newValue, `isApplyingFromDb:`, this.isApplyingFromDb)
      // todo: check if self-patch pending ; or check timestamp difference ~500 ms or if value differed (though if it is converted to html, it will differ)
      if ( ! this.isApplyingFromDb && this.initialDataArrived ) {
        // debugLog(`this.lastLocalEditByUserMs`, this.lastLocalEditByUserMs, this)
        this.lastLocalEditByUserMs = Date.now()
        // debugLog('ViewSyncer - patchThrottled', newValue)
        this.item$.patchThrottled(newValue) // TODO: patchThrottled({cleanUp: true}) -- trim to null; maybe remove unused fields to save bytes and not put `null`
      }
    })

  }

  getLastEditTimeForField(field: TKey): number {
    return this.lastLocalEditByUserMs
  }

  /* To prevent incoming changes overwriting user edit */
  private hasEnoughTimePassedFromLastUserEditToApplyFromDb() {
    const msFromLastLocalEdit = Date.now() - this.lastLocalEditByUserMs
    // debugLog(`msFromLastLocalEdit`, msFromLastLocalEdit, this.lastLocalEditByUserMs)
    return msFromLastLocalEdit > this.MIN_INTERVAL_MS
  }

  /* TODO: rename to ...WasSetInUI / inUi */
  onInitialDataWasSet() {
    this.initialDataArrivalWasSetExplicitly = true
  }

  private shouldApplyFromDb(newDataFromDb: TItemInMem | undefined | null): boolean {
    /* NOTE: interestingly, setting empty string in tinymce only syncs to app in firefox when editor losing focus
      not really, coz editing adding chars also does not sync the last chars until losing editor focus / could be related to throttleTime vs debounce?
     */
    if ( this.fieldNameHack && this.initialDataArrived ) {
      const lastValFromDbElement = this.lastValFromDb?.[this.fieldNameHack]
      const newDataFromDbElement = newDataFromDb?.[this.fieldNameHack]
      if ( lastValFromDbElement === newDataFromDbElement ) {
        // console.log(`shouldApplyFromDb: lastValFromDbElement equal`, this.fieldNameHack, lastValFromDbElement, newDataFromDbElement)
        return false
      }
    }

    return this.hasEnoughTimePassedFromLastUserEditToApplyFromDb()
  }
}
