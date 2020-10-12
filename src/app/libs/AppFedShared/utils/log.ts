// import { DebugService } from '../core/debug.service'

export function FIXME(...args: any): any {
  errorAlert('================ FIXME!', ...args)
}

const enableLogging = true

export function debugLog(...args: any) {
  if (enableLogging) {
    console.log('debugLog', ...args)
  }
}

export function errorAlert(...args: any) {
  const prefix = 'ERROR: errorAlert: '
  let toString = 'toString failed'
  try {
    toString = args.join(', ')
  } catch {
    // no op
  }
  window.alert(prefix + '(see console for details) ' + toString)
  console.error(prefix, ...args)
}

export function errorAlertAndThrow(...args: any) {
  errorAlert(...args)
  throw new Error(args)
}


// idea: debugLogFirst / debugLogEveryX

export function apfLogger(instance: any) {
  return console // HACK
}

export function apfErrLog(instance: any, ...rest: any) {
  return console.error('' + instance, ...rest)
}
