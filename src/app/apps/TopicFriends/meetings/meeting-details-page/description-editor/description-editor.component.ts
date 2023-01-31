import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, UntypedFormControl, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: 'app-description-editor',
  templateUrl: './description-editor.component.html',
  styleUrls: ['./description-editor.component.sass'],
})
export class DescriptionEditorComponent implements OnInit {

  @Input() control ! : UntypedFormControl;

  constructor() { }

  ngOnInit() {}
}
