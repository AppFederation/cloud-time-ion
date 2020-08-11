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
  }

}
