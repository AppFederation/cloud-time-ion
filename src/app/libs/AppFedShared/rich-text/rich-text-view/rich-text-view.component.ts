import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser'
import {convertToHtmlIfNeeded} from '../../utils/html-utils'


@Component({
  selector: 'app-rich-text-view',
  templateUrl: './rich-text-view.component.html',
  styleUrls: ['./rich-text-view.component.sass'],
})
export class RichTextViewComponent implements OnInit {

  @Input() htmlString ! : string

  constructor(
    public domSanitizer: DomSanitizer,
  ) { }


  ngOnInit() {
    this.htmlString = convertToHtmlIfNeeded(this.htmlString)
  }

}
