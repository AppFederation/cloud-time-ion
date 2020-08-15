import {Component, Input, OnInit} from '@angular/core';
import {OptionsService} from '../../core/options.service'

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.sass'],
})
export class ToggleComponent implements OnInit {

  @Input() option ! : string

  constructor(
    public optionsService: OptionsService,

  ) { }

  ngOnInit() {}

}
