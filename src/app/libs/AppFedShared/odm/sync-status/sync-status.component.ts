import { Component, OnInit } from '@angular/core';
import {SyncStatusService} from '../sync-status.service'

@Component({
  selector: 'odm-sync-status',
  templateUrl: './sync-status.component.html',
  styleUrls: ['./sync-status.component.sass'],
})
export class SyncStatusComponent implements OnInit {

  constructor(
    public syncStatusService: SyncStatusService,
  ) { }

  ngOnInit() {}

}
