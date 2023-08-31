import {Component, Input, OnInit} from '@angular/core';
import {LearnItem$} from '../../models/LearnItem$'
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject'

@Component({
  selector: 'app-item-sub-items',
  templateUrl: './item-sub-items.component.html',
  styleUrls: ['./item-sub-items.component.sass'],
})
export class ItemSubItemsComponent implements OnInit {

  /** maybe could strive to accept just OdmList$ */
  @Input() item$!: LearnItem$

  // list$!: BehaviorSubject<LearnItem$[]>


  /* might want an @Input with root-based tree class like in OrYoL for operations on entire tree like calculating, finding node below, etc.
  * The root is the one to which the URL points
  * */

  constructor() { }

  ngOnInit() {
    // this.list$ = this.item$.children$.list$
  }

  newItem() {
    // this.item$.children$.add(new LearnItem$(this.item$.odmService, undefined, { title: 'Test title ' + new Date() } as any))
  }
}
