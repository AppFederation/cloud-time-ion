import { Component, OnInit } from '@angular/core';
import {LocalDebugOptionsService} from '../../../../apps/Learn/core/local-debug-options.service'

@Component({
  selector: 'app-generated-content-options',
  templateUrl: './generated-content-options.component.html',
  styleUrls: ['./generated-content-options.component.sass'],
})
export class GeneratedContentOptionsComponent implements OnInit {

  public isSelected;

  constructor(private localDebugOptionsService: LocalDebugOptionsService) {
    this.isSelected = localDebugOptionsService.getCurrentGeneratedDataValue();
  }

  ngOnInit() {
    this.localDebugOptionsService.toggleGeneratedData(this.isSelected)
  }

  toggleGeneratedData() {
    this.localDebugOptionsService.toggleGeneratedData(this.isSelected)
  }

}
