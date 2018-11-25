import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject'

export type Command = string

@Injectable()
export class CommandsService {

  commands$ = new Subject<Command>()

  constructor() { }

  reorderUp() {
    this.commands$.next('reorderUp')
  }

  reorderDown() {
    this.commands$.next('reorderDown')
  }

  toggleDone() {
    this.commands$.next('toggleDone')
  }

}
