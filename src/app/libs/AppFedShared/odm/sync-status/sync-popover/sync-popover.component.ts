import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../../../auth/auth.service'
import {SyncStatusService} from '../../sync-status.service'
import {StatsHistoryService} from '../../../../../apps/Learn/core/stats-history.service'
import {LearnStatsService} from '../../../../../apps/Learn/core/learn-stats.service'
import {OptionsService} from '../../../../../apps/Learn/core/options.service'

@Component({
  selector: 'app-sync-popover',
  templateUrl: './sync-popover.component.html',
  styleUrls: ['./sync-popover.component.sass'],
})
export class SyncPopoverComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public syncStatusService: SyncStatusService,
    public learnStatsService: LearnStatsService,
    public optionsService: OptionsService,
  ) { }

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
}
