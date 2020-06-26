import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore'
import {sidesDefs, sidesDefsArray} from '../core/sidesDefs'
import {LearnItem} from '../models/LearnItem'


@Component({
  selector: 'app-actionable-item',
  templateUrl: './actionable-item.component.html',
  styleUrls: ['./actionable-item.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionableItemComponent implements OnInit {

  sidesDefsArray = sidesDefsArray

  @Input() item: LearnItem
  // @Input() search: string

  constructor(
    protected angularFirestore: AngularFirestore,
  ) { }

  ngOnInit() {}

  joinedSides() {
    // this seems very slow
    return LearnItem.prototype.joinedSides.call(this.item) // this.item.joinedSides()
  }
}
