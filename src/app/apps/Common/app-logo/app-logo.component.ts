import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'

@Component({
  selector: 'app-app-logo',
  templateUrl: './app-logo.component.html',
  styleUrls: ['./app-logo.component.sass'],
})
export class AppLogoComponent implements OnInit {

  constructor(
    public router: Router,
  ) { }

  ngOnInit() {}

}
