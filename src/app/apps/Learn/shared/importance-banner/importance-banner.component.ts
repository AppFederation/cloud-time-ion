import {Component, Input, OnInit} from '@angular/core';
import {LearnItem$} from '../../models/LearnItem$'

@Component({
  selector: 'app-importance-banner',
  templateUrl: './importance-banner.component.html',
  styleUrls: ['./importance-banner.component.sass'],
})
export class ImportanceBannerComponent implements OnInit {

  @Input()
  item$ ! : LearnItem$

  constructor() { }

  ngOnInit() {}

}
