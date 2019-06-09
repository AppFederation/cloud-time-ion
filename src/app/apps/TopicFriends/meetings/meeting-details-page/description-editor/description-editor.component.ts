import {Component, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-description-editor',
  templateUrl: './description-editor.component.html',
  styleUrls: ['./description-editor.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DescriptionEditorComponent),
      multi: true,
    }
  ],
})
export class DescriptionEditorComponent implements OnInit, ControlValueAccessor {

  constructor() { }

  ngOnInit() {}

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: any): void {
  }

}
