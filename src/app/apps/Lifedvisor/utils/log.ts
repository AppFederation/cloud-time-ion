
export function FIXME(...args: any): any {
  console.error('================ FIXME!', ...args)
}

const enableLogging = true

// export function debugLog(...args) {
//   if (enableLogging && DebugService.isDebug) {
//     console.log('debugLog', ...args)
//   }
// }

// export function traceLog(...args) {
//   // ignore for now as too voluminous -- later have UI switch
//   if (enableLogging && DebugService.isDebug) {
//     console.log('traceLog', ...args)
//   }
// }

export function errorAlert(...args: any) {
  const prefix = 'ERROR: errorAlert: '
  console.log(prefix, ...args)
  window.alert(prefix + '(see console for details) ' + args.join(', '))
}
