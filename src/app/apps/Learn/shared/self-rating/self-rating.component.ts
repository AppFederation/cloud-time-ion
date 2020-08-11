import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NumericPickerVal} from '../../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component'
import {errorAlert} from '../../../../libs/AppFedShared/utils/log'
import {LearnItem$} from '../../models/LearnItem$'

@Component({
  selector: 'app-self-rating',
  templateUrl: './self-rating.component.html',
  styleUrls: ['./self-rating.component.sass'],
})
export class SelfRatingComponent implements OnInit {

  @Input()
  item$ ? : LearnItem$

  @Input()
  autoSave = true

  @Output() numericValue = new EventEmitter<NumericPickerVal>()

  constructor() { }

  ngOnInit() {}

  onChangeSelfRating($event: NumericPickerVal) {
    this.numericValue.emit($event)
    if ( this.autoSave ) {
      if ( ! this. item$ ) {
        errorAlert(`cannot onChangeSelfRating on this. item$` + this. item$)
      } else {
        this.item$.setNewSelfRating($event)
      }
    }

    // const item = this.item$.currentVal
    // const previousRating = item.lastSelfRating
    // let newRating = $event
    // if ( newRating === 2 && previousRating >= 2 ) {
    //   const enoughTimePassed = false // TODO: based on calculation
    //   if ( enoughTimePassed ) {
    //     newRating = previousRating + 1
    //   }
    // }
    //
    // this.item$.patchThrottled({
    //   lastSelfRating: newRating,
    //   whenLastSelfRated: OdmBackend.nowTimestamp(),
    //   selfRatingsCount: (item.selfRatingsCount || 0) + 1,
    // })
  }

}
