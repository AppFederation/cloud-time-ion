import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../../../auth/auth.service'

@Component({
  selector: 'app-sync-popover',
  templateUrl: './sync-popover.component.html',
  styleUrls: ['./sync-popover.component.sass'],
})
export class SyncPopoverComponent implements OnInit {

  constructor(
    public authService: AuthService,
  ) { }

  ngOnInit() {}

  logIn() {
    this.authService.logInViaGoogle()
  }

}
