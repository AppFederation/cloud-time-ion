import { Component, OnInit } from '@angular/core';

export class RangeFilterVal {
  active: boolean
  min: number
  max: number
}

@Component({
  selector: 'app-range-filter',
  templateUrl: './range-filter.component.html',
  styleUrls: ['./range-filter.component.sass'],
})
export class RangeFilterComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
