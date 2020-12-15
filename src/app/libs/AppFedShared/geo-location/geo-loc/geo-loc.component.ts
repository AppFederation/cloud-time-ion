import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-geo-loc',
  templateUrl: './geo-loc.component.html',
  styleUrls: ['./geo-loc.component.sass'],
})
export class GeoLocComponent implements OnInit {

  @Input() geoLoc ? : any

  constructor() { }

  ngOnInit() {}

}
