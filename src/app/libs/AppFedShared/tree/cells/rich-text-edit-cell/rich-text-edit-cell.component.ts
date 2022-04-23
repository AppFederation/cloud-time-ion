import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {OdmCell} from '../OdmCell'
import {CellNavigationService} from '../../../cell-navigation.service'

@Component({
  selector: 'app-rich-text-edit-cell',
  templateUrl: './rich-text-edit-cell.component.html',
  styleUrls: ['./rich-text-edit-cell.component.sass'],
})
export class RichTextEditCellComponent implements OnInit {

  @ViewChild('contentEditableEl', {static: true})
  contentEditableEl !: ElementRef

  @Input()
  cell !: OdmCell

  constructor(
    public cellNavigationService: CellNavigationService
  ) {

  }

  ngOnInit() {
    this.contentEditableEl
      .nativeElement.addEventListener('input', (event: any) => this.onInputChanged(event, this.getInputValue()))
  }

  protected onInputChanged(event: any, newValue: any) {
    console.log('onInputChanged', newValue)
    this.cell.patchThrottled(newValue, event)
  }

  getInputValue(): string {
    return this.contentEditableEl.nativeElement.innerHTML
  }

}
