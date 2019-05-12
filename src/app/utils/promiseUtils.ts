import {errorAlert} from "./log";

export function ignorePromise(_promise: Promise<any>) {
  _promise.catch(error => {
    errorAlert('Promise error', error)
  })
}
