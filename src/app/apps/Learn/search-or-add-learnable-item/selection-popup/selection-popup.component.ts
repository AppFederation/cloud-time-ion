import {Component, Input, OnInit} from '@angular/core';
import {SelectionManager} from '../SelectionManager'
import {ignorePromise} from '../../../../libs/AppFedShared/utils/promiseUtils'
import {AlertController} from '@ionic/angular'
import {LearnDoService} from '../../core/learn-do.service'

@Component({
  selector: 'app-selection-popup',
  templateUrl: './selection-popup.component.html',
  styleUrls: ['./selection-popup.component.sass'],
})
export class SelectionPopupComponent implements OnInit {

  @Input() selection ! : SelectionManager


  constructor(
    public alertController: AlertController,
    public itemsService: LearnDoService,
  ) { }

  ngOnInit() {}

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
}
