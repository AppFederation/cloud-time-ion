import { Component, OnInit } from '@angular/core';
import {SyncStatusService} from '../sync-status.service'
import {PopoverController} from '@ionic/angular'
import {SyncPopoverComponent} from './sync-popover/sync-popover.component'

@Component({
  selector: 'odm-sync-status',
  templateUrl: './sync-status.component.html',
  styleUrls: ['./sync-status.component.sass'],
})
export class SyncStatusComponent implements OnInit {

  constructor(
    public syncStatusService: SyncStatusService,
    public popoverController: PopoverController,
  ) { }

  ngOnInit() {}

  async onClick(event) {

    const popover = await this.popoverController.create({
      component: SyncPopoverComponent,
      event: event,
      translucent: true,
      mode: 'ios',
    });
    return await popover.present();
  }
}
