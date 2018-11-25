import { DebugService } from '../core/debug.service'

export function FIXME(message?): any {
  console.error('================ FIXME!', message)
}

const enableLogging = true

export function debugLog(...args) {
  if (enableLogging && DebugService.isDebug) {
    console.log('debugLog', ...args)
  }
}
