import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms'

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.sass'],
})
export class SliderComponent implements OnInit {

  @Input() minLabel ! : string

  @Input() maxLabel ! : string

  @Input() minVal ! : number

  @Input() maxVal ! : number

  @Input() step : number = 1

  @Input() fractionDigits : number = 2

  @Input() scale : number = 1

  @Input() control ! : FormControl


  constructor() { }

  ngOnInit() {}

}
