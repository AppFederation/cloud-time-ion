// adapted from https://netbasal.com/how-to-add-angular-component-input-validation-b078a30af97f

// also can use template arguments:
// https://medium.com/@timdeschryver/required-input-properties-3eabe7724e6b

// https://stackblitz.com/edit/angular-decorator-is-required-validator-thsfp9?file=package.json
//
// https://itnext.io/custom-decorators-in-angular-c54da873b3b3
//
// https://github.com/angular/angular/issues/31495#issuecomment-677433239 -> ...
// https://github.com/angular/angular/issues/16023
// https://github.com/angular/angular/pull/35464

// https://dev.to/angular/decorators-do-not-work-as-you-might-expect-3gmj

// https://gist.github.com/remojansen/16c661a7afd68e22ac6e

import {errorAlert} from '../log'
import {isNotNullish, isNullish} from '../utils'

export function Required(/*bindingPropertyName?: string*/) {
  return function (
    target: any,
    key: string | symbol,
    // descriptor: PropertyDescriptor
  ) {
    console.log(`Required 2`, arguments, `target`, target)
    const NG_ON_ON_INIT_NAME = 'ngOnInit';

    /** ngOnInit might not be implemented by this component */
    const ngOnInitClone: Function|null = target[NG_ON_ON_INIT_NAME];

    // Object.defineProperty(target, NG_ON_ON_INIT_NAME, {
    //   value: function() {
    target.ngOnInit = function() {
      // console.log(`Required ngOnInit`, arguments)

      if ( isNullish( this[key] ) ) {
        errorAlert(
          target.constructor.name +
          `: ${String(key)} Input() is required, but was not provided`
        );
      }
      // Calling the original ngOnInit with its original context
      //
      ngOnInitClone ?. call(this);
    }
    // });
  };
}
