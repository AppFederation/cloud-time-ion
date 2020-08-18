import {Component, Input, OnInit} from '@angular/core';
import {OptionsService} from '../../core/options.service'

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.sass'],
})
export class ToggleComponent implements OnInit {

  /* maybe better smaller building blocks and make this component to be custom form
    control (more flexible in case I need some local options that are not to be saved)
    and then have a wrapper component that would handle options
  */
  @Input() option ! : string

  constructor(
    public optionsService: OptionsService,
  ) { }

  ngOnInit() {}

}
