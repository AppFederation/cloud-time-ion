// adapted from https://netbasal.com/how-to-add-angular-component-input-validation-b078a30af97f

// also can use template arguments:
// https://medium.com/@timdeschryver/required-input-properties-3eabe7724e6b

import {errorAlert} from '../log'
import {isNotNullish, isNullish} from '../utils'

export function LogBROKEN(/*bindingPropertyName?: string*/) {
  return function (
    target: any, key: string | symbol, descriptor: PropertyDescriptor
  ) {
    console.log(`Log decorator 2`, arguments, `target`, target)

    const origMethod: Function|null = target[key];

    // Object.defineProperty(target, NG_ON_ON_INIT_NAME, {
    //   value: function() {
    target[key] = function( ... args: any[]) {
      errorAlert(`Log decorator func wrapper`, key)
      console.log(`Log decorator func wrapper`, arguments)
      origMethod ?. apply(this, args);
    }
    // target[key]()
    // });
  };
}
