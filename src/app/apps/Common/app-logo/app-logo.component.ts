import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'

@Component({
  selector: 'app-app-logo',
  templateUrl: './app-logo.component.html',
  styleUrls: ['./app-logo.component.sass'],
})
export class AppLogoComponent implements OnInit {

  /** workaround for logo disappearing on page navigation */
  fillSuffix = (''+Math.random()).replace('.', '')

  fill1Id = 'fill1-' + this.fillSuffix
  fill2Id = 'fill2-' + this.fillSuffix

  constructor(
    public router: Router,
  ) { }

  ngOnInit() {
    console.log('suffix', this.fillSuffix)
  }

}
