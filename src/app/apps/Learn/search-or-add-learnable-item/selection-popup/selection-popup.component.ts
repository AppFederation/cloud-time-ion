import {Component, Input, OnInit} from '@angular/core';
import {SelectionManager} from '../SelectionManager'
import {ignorePromise} from '../../../../libs/AppFedShared/utils/promiseUtils'
import {AlertController} from '@ionic/angular'
import {LearnDoService} from '../../core/learn-do.service'
import {DictPatch, PatchableObservable} from '../../../../libs/AppFedShared/utils/rxUtils'
import {LearnItem} from '../../models/LearnItem'
import {CachedSubject} from '../../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {LearnItem$} from '../../models/LearnItem$'
import {OdmService2} from '../../../../libs/AppFedShared/odm/OdmService2'
import {OdmItemId} from '../../../../libs/AppFedShared/odm/OdmItemId'
import {nullish} from '../../../../libs/AppFedShared/utils/type-utils'

export class MultiSelectItem$<TInMem> implements PatchableObservable<LearnItem | nullish> {

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
    public itemsService: LearnDoService,
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
}
