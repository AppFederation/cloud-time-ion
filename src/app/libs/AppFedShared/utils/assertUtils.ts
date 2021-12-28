import {errorAlert} from './log'

export function assertTruthy(valueToAssert: any, name: string) {
  if (!valueToAssert) {
    errorAlert(`'${name}': must be truthy, is: "${valueToAssert}"`)
  }
}
