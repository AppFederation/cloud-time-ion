import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-rich-text-edit-cell',
  templateUrl: './rich-text-edit-cell.component.html',
  styleUrls: ['./rich-text-edit-cell.component.sass'],
})
export class RichTextEditCellComponent implements OnInit {

  @ViewChild('contentEditableEl', {static: true}) contentEditableEl: ElementRef

  constructor() { }

  ngOnInit() {
    this.contentEditableEl
      .nativeElement.addEventListener('input', (event) => this.onInputChanged(event, this.getInputValue()))
  }

  protected onInputChanged(event, newValue) {
    console.log('onInputChanged', newValue)
  }

  getInputValue(): string {
    return this.contentEditableEl.nativeElement.innerHTML
  }

}
