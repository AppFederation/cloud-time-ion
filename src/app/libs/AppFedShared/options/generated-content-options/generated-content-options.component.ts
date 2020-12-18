import { Component, OnInit } from '@angular/core';
import {OptionsService} from '../../../../apps/Learn/core/options.service'

@Component({
  selector: 'app-generated-content-options',
  templateUrl: './generated-content-options.component.html',
  styleUrls: ['./generated-content-options.component.sass'],
})
export class GeneratedContentOptionsComponent implements OnInit {

  public isSelected = false;

  constructor(private optionsService: OptionsService) { }

  ngOnInit() {
    this.optionsService.toggleGeneratedData(this.isSelected)
  }

  toggleGeneratedData() {
    this.optionsService.toggleGeneratedData(this.isSelected)
  }

}
