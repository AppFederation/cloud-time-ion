// import { DebugService } from '../core/debug.service'

export function FIXME(...args): any {
  console.error('================ FIXME!', ...args)
}

const enableLogging = true

export function debugLog(...args) {
  if (enableLogging) {
    console.log('debugLog', ...args)
  }
}

export function errorAlert(...args) {
  const prefix = 'ERROR: errorAlert: '
  window.alert(prefix + '(see console for details) ' + args.join(', '))
  console.error(prefix, ...args)
}
