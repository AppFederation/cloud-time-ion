import {ControlValueAccessor} from '@angular/forms'

export abstract class CustomFormControl<TVal> implements ControlValueAccessor {

  onChange ! : (newVal: TVal) => any;

  private isDisabled = false

  private value ? : TVal

  constructor() {}

  writeValue( value : TVal ) : void {
    this.value = value
  }

  registerOnChange( fn : (newVal: TVal) => any ) : void {
    this.onChange = fn;
  }

  fireOnChange($event: TVal ) {
    this.onChange ?. ($event);
  }

  setDisabledState( isDisabled : boolean ) : void {
    this.isDisabled = isDisabled
  }

  // writeValue(value: any): void { }
  // registerOnChange(fn: any): void { }
  /* TODO */
  registerOnTouched(fn: any): void { }
  // setDisabledState(isDisabled: boolean): void { }

}
