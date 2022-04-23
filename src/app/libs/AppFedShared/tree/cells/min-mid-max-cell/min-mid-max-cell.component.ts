import {Component, Input, OnInit} from '@angular/core';
import {OdmCell} from '../OdmCell'

@Component({
  selector: 'app-min-mid-max-cell',
  templateUrl: './min-mid-max-cell.component.html',
  styleUrls: ['./min-mid-max-cell.component.sass'],
})
export class MinMidMaxCellComponent implements OnInit {

  @Input()
  cell !: OdmCell

  constructor() { }

  ngOnInit() {}

}
