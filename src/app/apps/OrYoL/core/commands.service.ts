import { Injectable } from '@angular/core';
import { NavigationService } from './navigation.service'
import {Subject} from 'rxjs'

export type Command = string

@Injectable({providedIn: 'root'})
export class CommandsService {

  commands$ = new Subject<Command>()

  constructor(
    private navigationService: NavigationService,
  ) { }

  reorderUp() {
    this.commands$.next('reorderUp')
  }

  reorderDown() {
    this.commands$.next('reorderDown')
  }

  toggleDone() {
    this.commands$.next('toggleDone')
  }

  planToday() {
    // navigate to last child of Day Plans node - 'item_35023937-195c-4b9c-b265-5e8a01cf397e'
    // this.navigationService.navigateToNodeLastChild('item_35023937-195c-4b9c-b265-5e8a01cf397e')
  }
}
