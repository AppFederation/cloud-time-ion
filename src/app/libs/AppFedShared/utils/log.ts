// import { DebugService } from '../core/debug.service'

export function FIXME(...args): any {
  errorAlert('================ FIXME!', ...args)
}

const enableLogging = true

export function debugLog(...args) {
  if (enableLogging) {
    console.log('debugLog', ...args)
  }
}

export function errorAlert(...args) {
  const prefix = 'ERROR: errorAlert: '
  console.error(prefix, ...args)
  window.alert(prefix + '(see console for details) ' + args.join(', '))
}

export function apfLogger(instance) {
  return console // HACK
}

export function apfErrLog(instance, ...rest) {
  return console.error('' + instance, ...rest)
}
