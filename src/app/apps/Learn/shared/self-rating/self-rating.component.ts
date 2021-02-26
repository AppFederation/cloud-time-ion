import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  btn,
  btnVariant,
  ButtonsDescriptor,
  ButtonVariantDescriptor,
  NumericPickerVal,
} from '../../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component'
import {errorAlert} from '../../../../libs/AppFedShared/utils/log'
import {LearnItem$} from '../../models/LearnItem$'
import {intensityBtnVariant} from '../../../../libs/LifeSuiteShared/edit-shared/importance-edit/importance-edit.component'

@Component({
  selector: 'app-self-rating',
  templateUrl: './self-rating.component.html',
  styleUrls: ['./self-rating.component.sass'],
})
export class SelfRatingComponent implements OnInit {

  buttonDescriptors = new ButtonsDescriptor<number, string>([
    btn({
      btnVariants: [
        new ButtonVariantDescriptor(0),
        new ButtonVariantDescriptor(0.5),
        new ButtonVariantDescriptor(0.25),
        new ButtonVariantDescriptor(0.75),
      ],
      color: 'danger',
    }),
    btn({
      btnVariants: [
        new ButtonVariantDescriptor(1),
        new ButtonVariantDescriptor(1.5),
        new ButtonVariantDescriptor(1.25),
        new ButtonVariantDescriptor(1.75),
      ],
      color: 'warning',

    }),
    btn({
      btnVariants: [
        new ButtonVariantDescriptor(2),
        new ButtonVariantDescriptor(2.5),
        new ButtonVariantDescriptor(2.25),
        new ButtonVariantDescriptor(2.75),
      ],
      color: 'success',
    }),
  ])


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
