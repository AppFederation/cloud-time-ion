import { Component, OnInit } from '@angular/core';
import {SyncStatusService} from '../sync-status.service'
import {PopoverController} from '@ionic/angular'
import {SyncPopoverComponent} from './sync-popover/sync-popover.component'
import {map} from 'rxjs/operators'
import {AuthService} from '../../../../auth/auth.service'

@Component({
  selector: 'odm-sync-status-icon',
  templateUrl: './sync-status-icon.component.html',
  styleUrls: ['./sync-status-icon.component.sass'],
})
export class SyncStatusIconComponent implements OnInit {

  showShadow = true

  /** workaround for logo disappearing on page navigation */
  fillSuffix = (''+Math.random()).replace('.', '')

  fill1Id = 'fill1-' + this.fillSuffix

  get pendingUploadsCount$() { return this.syncStatus$.pipe(map(s => s.pendingUploadsCount))}

  get pendingDownloadsCount$() { return this.syncStatus$.pipe(map(s => s.pendingDownloadsCount))}

  get syncStatus$() { return this.syncStatusService.syncStatus$ }

  constructor(
    public syncStatusService: SyncStatusService,
    public popoverController: PopoverController,
  ) { }

  ngOnInit() {}

  async onClick(event: any) {

    const popover = await this.popoverController.create({
      component: SyncPopoverComponent,
      event: event,
      translucent: true,
      mode: 'ios',
    });
    return await popover.present();
  }
}
