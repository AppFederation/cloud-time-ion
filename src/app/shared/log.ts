import { DebugService } from '../core/debug.service'

export function FIXME(...args): any {
  console.error('================ FIXME!', ...args)
}

const enableLogging = true

export function debugLog(...args) {
  if (enableLogging && DebugService.isDebug) {
    console.log('debugLog', ...args)
  }
}
