import {Component, Injector, OnInit} from '@angular/core';
import {g} from '../g'

/** This is syntactic sugar and automation to improve DX where angular has DX shortcomings
 * and to reduce boilerplate and distractions when coding ACTUAL FEATURES
 * */
@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.sass'],
})
export class BaseComponent implements OnInit {

  constructor(
    public injector?: Injector
  ) {

  }


  /** to have it in template scope */
  public g = g

  /** this way we refer to features specific to this component (enabled per page/feature basis)
   *
   * Initializing this could actually work nicely as injection token on feature modules!
   * */
  public feat = g.feat

  // constructor( /* prolly will need to pass injector */ ) { }

  ngOnInit() {}

  // could have automatic rxjs subscribe/unsubscribe
  subscribeAuto() {

  }

}
