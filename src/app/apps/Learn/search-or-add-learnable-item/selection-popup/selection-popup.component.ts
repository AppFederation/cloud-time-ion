import {Component, Input, OnInit} from '@angular/core';
import {SelectionManager} from '../SelectionManager'
import {ignorePromise} from '../../../../libs/AppFedShared/utils/promiseUtils'
import {AlertController} from '@ionic/angular'
import {LearnItemItemsService} from '../../core/learn-item-items.service'
import {DictPatch, PatchableObservable} from '../../../../libs/AppFedShared/utils/rxUtils'
import {LearnItem} from '../../models/LearnItem'
import {CachedSubject} from '../../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {LearnItem$} from '../../models/LearnItem$'
import {OdmService2} from '../../../../libs/AppFedShared/odm/OdmService2'
import {OdmItemId} from '../../../../libs/AppFedShared/odm/OdmItemId'
import {nullish} from '../../../../libs/AppFedShared/utils/type-utils'
import {isNullish} from '../../../../libs/AppFedShared/utils/utils'
import {ItemId} from '../../../../libs/AppFedShared/odm/OdmCollectionBackend'
import {ValueDistribution} from '../../../../libs/AppFedShared/utils/time/parse-duration'
import {OdmInMemItem} from '../../../../libs/AppFedShared/odm/OdmItem$2'

export class MultiSelectItem$<TInMem extends OdmInMemItem> implements PatchableObservable<LearnItem | nullish> {

  constructor(
    public itemsService: OdmService2<any, TInMem, any, any>,
    public getSelected: () => OdmItemId[],
  ) {
    this.locallyVisibleChanges$.nextWithCache({} as LearnItem) /* needed to init ViewSyncer */
  }


  locallyVisibleChanges$ = new CachedSubject<LearnItem | nullish>()

  patchThrottled(patch: DictPatch<LearnItem>) {
    const selected = this.getSelected()
    console.log(`MultiSelectItem$ patchThrottled`, patch, selected)
    this.itemsService.patchThrottledMultipleByIds(selected, patch as any/*TODO type*/)
  }

}

/* =============== */

@Component({
  selector: 'app-selection-popup',
  templateUrl: './selection-popup.component.html',
  styleUrls: ['./selection-popup.component.sass'],
})
export class SelectionPopupComponent implements OnInit {

  @Input() selection ! : SelectionManager

  isEditing = false

  multiSelectItems$ = new MultiSelectItem$<LearnItem>(
    this.itemsService,
    () => this.selection.getEffectivelySelected()
  )

  constructor(
    public alertController: AlertController,
    public itemsService: LearnItemItemsService,
  ) { }

  ngOnInit() {
  }

  async askDelete() {
    const effectivelySelected = this.selection.getEffectivelySelected()
    const alert = await this.alertController.create({
      header: `Delete ${effectivelySelected.length} items ?`,
      message: 'This <b>cannot</b> be undone',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'DELETE',
          handler: async () => {
            this.itemsService.deleteAll(new Set(effectivelySelected))
            this.selection.unselectAll()
            // this.doc.update({
            //   whenDeleted: new Date(),
            // })
          }
        }
      ]
    })
    await alert.present()
  }

  edit() {
    this.isEditing = ! this.isEditing
  }

  sumEstimates() {
    const selected = this.selection.getEffectivelySelected() as ItemId[]
    const aggregate = {
      aggregateValue: 0,
      aggregateDistribution: new ValueDistribution(0, 0, 0),
      missingValuesCount: 0
    }
    for ( let itemId of selected ){
      const item$ = this.itemsService.obtainItem$ById(itemId)
      const val = item$.val?.getDurationEstimateMinutes()
      const distrib = item$.val?.getDurationEstimateMinutesDistribution()
      if ( isNullish(val) || !val ) {
        aggregate.missingValuesCount ++
      } else {
        aggregate.aggregateValue += val
      }
      aggregate.aggregateDistribution.add(distrib)
    }
    return aggregate
  }
}
