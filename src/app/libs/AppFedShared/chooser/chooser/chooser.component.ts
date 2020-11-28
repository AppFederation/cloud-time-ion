import {Component, Input, OnInit} from '@angular/core';
import {Required} from '../../utils/angular/Required.decorator'

@Component({
  selector: 'app-chooser',
  templateUrl: './chooser.component.html',
  styleUrls: ['./chooser.component.sass'],
})
export class ChooserComponent implements OnInit {

  @Required()
  @Input()
  allPossible: any[] = ['a', 'B']

  constructor() { }

  ngOnInit() {}

}
