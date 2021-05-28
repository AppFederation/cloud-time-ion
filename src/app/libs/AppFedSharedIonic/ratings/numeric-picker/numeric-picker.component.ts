import {ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from "@angular/forms";
import {JournalNumericDescriptor} from '../../../../apps/Journal/models/JournalNumericDescriptors'
import {range} from 'lodash-es'
import {debugLog} from '../../../AppFedShared/utils/log'
import {CustomFormControl} from '../../../AppFedShared/utils/angular/custom-form-control'

export class ButtonVariantDescriptor<TVal = any, TLabel = string | number> {
  constructor(
    public value: TVal,
    public label ? : TLabel,
    public id ? : string | number,
    public subLabel ? : string,
  ) {
    this.label ??= this.value as any as TLabel
    this.id ??= this.value as any
  }
}

export class ButtonDescriptor<TVal = any, TLabel = string | number> {
  constructor(
    public btnVariants: ButtonVariantDescriptor<TVal, TLabel>[],
    public color? : string,
  ) {}
}

export class ButtonsDescriptor<TVal = any, TLabel = string | number> {
  constructor(
    public buttons: ButtonDescriptor<TVal, TLabel> []
  ) {}

  /** Could return tuple of button and variant */
  findVariantByValue(value: TVal | undefined): [ButtonDescriptor, ButtonVariantDescriptor] | undefined {
    if ( ! value ) {
      return undefined
    }
    for ( let button of this.buttons ) {
      for ( let variant of button.btnVariants ) {
        if ( (value as any).id === variant.id || value === variant.value ) {
          return [button, variant] as any
        }
      }
    }
    return undefined
  }
}

export function btn(x: ButtonDescriptor) {
  return x as ButtonDescriptor<any, any>
  // return new ButtonDescriptor()
}

export function btnVariant(x: ButtonVariantDescriptor) {
  return x
  // return new ButtonDescriptor()
}

export type NumericPickerVal = number

function btnVariantSimple(val: number) {
  return {
    value: val,
    label: val,
    id: val,
  }
}

function numAndFracBtn(x: number): ButtonDescriptor {
  return new ButtonDescriptor(
    [
      btnVariantSimple(x),
      btnVariantSimple(x + 0.5),
    ]
  )
}

/* maybe: make it a custom form control
* TODO: rename: ButtonsPicker...
* */
@Component({
  selector: 'apf-numeric-picker',
  templateUrl: './numeric-picker.component.html',
  styleUrls: ['./mood-picker.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumericPickerComponent),
      multi: true
    }
  ]
})
export class NumericPickerComponent<TVal = any> extends CustomFormControl<TVal> implements OnInit {

  @Output() numericValue = new EventEmitter<NumericPickerVal>()

  @Input() numFieldDef ? : JournalNumericDescriptor

  @Input() minNum ! : number

  @Input() maxNum ! : number

  @Input()
  allowedVals: Array<any> = range(0, 11)

  @Input()
  buttonDescriptors ! : ButtonsDescriptor<any, any>

  // numValFormControl = new FormControl()

  // numVal ? : NumericPickerVal

  selectedVariant ? : ButtonVariantDescriptor<any>

  selectedButton ? : ButtonDescriptor<any>

  constructor() {
    super()
  }

  ngOnInit() {
    if ( this.allowedVals && ! this.buttonDescriptors ) {
      this.buttonDescriptors = new ButtonsDescriptor<any, any>(
        this.allowedVals.map(numAndFracBtn)
      )
    }
  }

  writeValue(value: TVal): void {
    super.writeValue(value);
    const found = this.buttonDescriptors.findVariantByValue(value)
    if ( found ) {
      this.selectedButton = found [ 0 ]
      this.selectedVariant = found [ 1 ]
    }
  }


  onButtonClick(buttonDesc: ButtonDescriptor) {
    const previousSelectedButton = this.selectedButton
    this.selectedButton = buttonDesc
    const btnVariants = this.selectedButton.btnVariants
    let newVariantIdx
    if ( previousSelectedButton === this.selectedButton ) {
      const currentVariantIdx = this.selectedButton.btnVariants.findIndex(
        (elem: ButtonVariantDescriptor) => elem.id === this.selectedVariant?.id)
      // debugLog(`currentVariantIdx`, currentVariantIdx, this.selectedButton.btnVariants, this.selectedVariant)
      newVariantIdx = (currentVariantIdx + 1) % btnVariants.length
    } else {
      newVariantIdx = 0
    }
    // debugLog(`newVariantIdx`, newVariantIdx)
    this.selectedVariant = btnVariants[newVariantIdx]
    const newValue = this.selectedVariant ?. value
    // debugLog(`value to emit`, newValue)
    this.numericValue.next(newValue)

    this.fireOnChange(newValue)
    // // note this triggers change detection
  }

  isSelected(btnDesc: ButtonDescriptor) {
    return this.selectedButton === btnDesc;
  }

  getDisplayedVariantForButton(btnDesc: ButtonDescriptor<any, any>): ButtonVariantDescriptor {
    return (this.isSelected(btnDesc) ? this.selectedVariant : btnDesc.btnVariants[0]) !
  }

}
