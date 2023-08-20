import {Component, Injector, OnInit} from '@angular/core';
import {AuthService} from '../../../../../auth/auth.service'
import {SyncStatusService} from '../../sync-status.service'
import {StatsHistoryService} from '../../../../../apps/Learn/core/stats-history.service'
import {LearnStatsService} from '../../../../../apps/Learn/core/learn-stats.service'
import {OptionsService} from '../../../../../apps/Learn/core/options.service'
import {BaseComponent} from '../../../base/base.component'

@Component({
  selector: 'app-sync-popover',
  templateUrl: './sync-popover.component.html',
  styleUrls: ['./sync-popover.component.sass'],
})
export class SyncPopoverComponent extends BaseComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public syncStatusService: SyncStatusService,
    public learnStatsService: LearnStatsService,
    public optionsService: OptionsService,
    injector: Injector,
  ) {
    super(injector)
  }

  ngOnInit() {}

  logIn() {
    this.authService.logInViaGoogle()
  }

  logOut() {
    this.authService.logout()
  }

  openOptions() {
    this.optionsService.openOptions()
  }

  toArray(t: any) {
    return Array.from(t)
  }
}
