import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-node-content',
  templateUrl: './node-content.component.html',
  styleUrls: ['./node-content.component.scss'],
})
export class NodeContentComponent implements OnInit, AfterViewInit {

  @ViewChild('input') inputEl: ElementRef;
  // https://stackoverflow.com/questions/44479457/angular-2-4-set-focus-on-input-element

  constructor() { }

  ngOnInit() {
  }

  focusInput() {
    this.inputEl.nativeElement.focus()
  }

  ngAfterViewInit(): void {
   this.focusInput()
  }

}
