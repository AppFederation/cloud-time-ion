import { Component, OnInit } from '@angular/core';
import {ItemProcessingService} from '../../core/item-processing.service'
import {Router} from '@angular/router'

@Component({
  selector: 'app-process-button',
  templateUrl: './process-button.component.html',
  styleUrls: ['./process-button.component.sass'],
})
export class ProcessButtonComponent implements OnInit {

  constructor(
    public itemProcessingService: ItemProcessingService,
    public router: Router,
  ) { }

  ngOnInit() {}

  onClick() {
    this.router.navigateByUrl('/learn/item/' + this.itemProcessingService.getNextItemToProcess()?.id)
  }
}
