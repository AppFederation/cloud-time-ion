import {Component, Input, OnInit} from '@angular/core';
import {NumericPickerVal} from '../../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component'
import {OdmBackend} from '../../../../libs/AppFedShared/odm/OdmBackend'
import {LearnItem, LearnItem$} from '../../models/LearnItem'

@Component({
  selector: 'app-self-rating',
  templateUrl: './self-rating.component.html',
  styleUrls: ['./self-rating.component.sass'],
})
export class SelfRatingComponent implements OnInit {

  @Input()
  item$: LearnItem$

  constructor() { }

  ngOnInit() {}

  onChangeSelfRating($event: NumericPickerVal) {
    const item = this.item$.currentVal
    const previousRating = item.lastSelfRating
    let newRating = $event
    if ( newRating === 2 && previousRating >= 2 ) {
      const enoughTimePassed = false // TODO: based on calculation
      if ( enoughTimePassed ) {
        newRating = previousRating + 1
      }
    }

    this.item$.patchThrottled({
      lastSelfRating: newRating,
      whenLastSelfRated: OdmBackend.nowTimestamp(),
      selfRatingsCount: (item.selfRatingsCount || 0) + 1,
    })
  }

}
