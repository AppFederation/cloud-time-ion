import {Component, Input, OnInit} from '@angular/core';
import {sidesDefs, sidesDefsArray} from '../../core/sidesDefs'
import {LearnItem} from '../../models/LearnItem'
import {funLevelsDescriptors} from '../../models/fields/fun-level.model'
import {importanceDescriptors} from '../../models/fields/importance.model'
import {debugLog} from '../../../../libs/AppFedShared/utils/log'
import {SelectionManager} from '../SelectionManager'
import {Required} from '../../../../libs/AppFedShared/utils/angular/Required.decorator'


@Component({
  selector: 'app-actionable-item',
  templateUrl: './actionable-item.component.html',
  styleUrls: ['./actionable-item.component.sass'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionableItemComponent implements OnInit {

  sidesDefsArray = sidesDefsArray

  _item ! : LearnItem

  @Required()
  @Input() selection ! : SelectionManager

  @Input() set item(item: LearnItem) {
    if ( this._item ) {
      console.log('set item to new one')
    }

    this._item = item
  }

  get item() { return this._item }

  @Input() index ! : number

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
    return LearnItem?.prototype?.joinedSides?.call(this.item) // this.item.joinedSides()
    // TODO: why possibly undefined? (error after strict settings )
  }

  joinedSidesOneLine() {
    return this.joinedSides()
      ?.replace('<p>', ' ')
      ?.replace('</p>', ' ')
  }

  getFunLevelDescriptor() {
    const funEstimateVal = this.item.funEstimate
    if ( funEstimateVal ) {
      return funLevelsDescriptors.descriptors[funEstimateVal.id]
    }
    return undefined
  }

  getImportanceDescriptor() {
    const val = this.item.importance
    if ( val ) {
      return importanceDescriptors[val.id]
    }
    return undefined
  }

  editEstimate() {
    debugLog(`editEstimate()`)
  }
}
