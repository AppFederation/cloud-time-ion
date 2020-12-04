import {Component, Input, OnInit} from '@angular/core';
import {Required} from '../../../../libs/AppFedShared/utils/angular/Required.decorator'
import {SelectionManager} from '../SelectionManager'
import {PopoverController} from '@ionic/angular'
import {SyncPopoverComponent} from '../../../../libs/AppFedShared/odm/sync-status/sync-popover/sync-popover.component'
import {SelectionPopupComponent} from '../selection-popup/selection-popup.component'

@Component({
  selector: 'app-selection-info',
  templateUrl: './selection-info.component.html',
  styleUrls: ['./selection-info.component.sass'],
})
export class SelectionInfoComponent implements OnInit {

  @Required()
  @Input() selection ! : SelectionManager


  constructor(
    public popoverController: PopoverController,
  ) { }

  ngOnInit() {}

  async onClick(event: any) {

    const popover = await this.popoverController.create({
      component: SelectionPopupComponent,
      componentProps: {
        selection: this.selection
      },
      event: event,
      translucent: false,
      mode: 'ios',
    });
    return await popover.present();
  }

}
