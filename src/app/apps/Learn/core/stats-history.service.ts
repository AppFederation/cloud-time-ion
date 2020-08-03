import {Injectable, Injector} from '@angular/core';
import {LearnStats, LearnStatsService} from './learn-stats.service'
import {HistoryService} from '../../../libs/AppFedShared/odm/history.service'
import {AuthService} from '../../../auth/auth.service'
import {errorAlert} from '../../../libs/AppFedShared/utils/log'

@Injectable({
  providedIn: 'root'
})
export class StatsHistoryService extends HistoryService<LearnStats, LearnStats> {

  constructor(
    private learnStatsService: LearnStatsService,
    private authService: AuthService /* */,
    injector: Injector,
  ) {
    super(injector, 'LearnStatsHistory')
    this.learnStatsService.stats$.subscribe(stats => {
      const user = this.authService.authUser$.lastVal
      if ( ! user ) {
        errorAlert(`new stats val for history, but no user: ` + user)
        return
      }
      if ( stats ) {
        const newVal = Object.assign({
          user: user // TODO: UID,
        }, stats)
        this.newValue(newVal)
      }
    })
  }
}
