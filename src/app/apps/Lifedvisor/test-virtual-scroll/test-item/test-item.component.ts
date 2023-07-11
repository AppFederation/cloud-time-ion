import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-test-item',
  templateUrl: './test-item.component.html',
  styleUrls: ['./test-item.component.scss'],
})
export class TestItemComponent implements OnInit {

  @Input() itemInput!: string

  constructor() { }

  ngOnInit() {}

}
