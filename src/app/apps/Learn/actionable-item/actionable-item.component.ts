import {Component, Input, OnInit} from '@angular/core';
import {sidesDefs, sidesDefsArray} from '../core/sidesDefs'
import {LearnItem} from '../models/LearnItem'


@Component({
  selector: 'app-actionable-item',
  templateUrl: './actionable-item.component.html',
  styleUrls: ['./actionable-item.component.sass'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionableItemComponent implements OnInit {

  sidesDefsArray = sidesDefsArray

  @Input() item: LearnItem
  // @Input() search: string

  // @Input() set item(i: LearnItem) {
  //   console.log(`@Input() set item`, i)
  //   this._item = i
  //   this.changeDetectorRef.detectChanges()
  // }
  //
  // get item() {
  //   return this._item
  // }

  constructor(
    // protected angularFirestore: AngularFirestore,
    // protected changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {}

  joinedSides() {
    // this seems very slow
    return LearnItem.prototype.joinedSides.call(this.item) // this.item.joinedSides()
  }
}
