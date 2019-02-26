export function nullOrUndef(x) {
  // cannot just do !x, because of zero
  return (x === null) || (x === undefined)
}

export function defined(x) {
  return ! nullOrUndef(x)
}

const uuidv4 = require('uuid/v4');



