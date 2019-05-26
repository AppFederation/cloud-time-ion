import {errorAlert} from "./log";

export function ignorePromise(_promise: Promise<any>, what?: string) {
  _promise.catch(error => {
    errorAlert('Promise error', error, 'while doing', what)
  })
}
