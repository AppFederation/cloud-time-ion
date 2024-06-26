import {debugLog} from './log'
import { v4 } from 'uuid';

export function nullOrUndef(x: any) {
  // cannot just do !x, because of zero
  return (x === null) || (x === undefined)
}

export function defined(x: any) {
  return ! nullOrUndef(x)
}

export const uuidv4 = v4;

function applyNegativeOffsetIfNecessary(caretPos: any, length: any) {
  if (caretPos < 0) {
    let offsetFromEnd = - caretPos - 1
    caretPos = length - offsetFromEnd
  }
  return caretPos
}

/** sets text cursor position */
export function setCaretPosition(elem: any, caretPos: any) {
  debugLog('setCaretPosition', arguments)
  if (elem != null) {
    let length = elem.value.length
    caretPos = applyNegativeOffsetIfNecessary(caretPos, length)
    if (elem.createTextRange) {
      const range = elem.createTextRange();
      range.move('character', caretPos);
      range.select();
    } else {
      if (elem.selectionStart) {
        elem.focus();
        elem.setSelectionRange(caretPos, caretPos);
      } else {
        elem.focus();
      }
    }
  }
}

export function setCaretPositionInContentEditable(el: any, caretPos: any) {

  caretPos = applyNegativeOffsetIfNecessary(caretPos, el.html().length)
  let range = document.createRange();
  let sel = window.getSelection();
  range.setStart(el.childNodes[2], 5);
  range.collapse(true);
  sel!.removeAllRanges();
  sel!.addRange(range);
}


export function setCaretOnContentEditable(target: any, isStart: any) {
  // debugLog('setCaretOnContentEditable', arguments)

  // https://stackoverflow.com/questions/4233265/contenteditable-set-caret-at-the-end-of-the-text-cross-browser
  const range = document.createRange();
  const sel = window.getSelection();
  if (isStart) {
    const newText = document.createTextNode('');
    target.appendChild(newText);
    range.setStart(target.childNodes[0], 0);
  } else {
    range.selectNodeContents(target);
  }
  range.collapse(isStart);
  sel!.removeAllRanges();
  sel!.addRange(range);
  target.focus();
  if ( target.select ) {
    target.select();
  }
}

export function isEmpty(val: any) {
  if ( typeof val === 'string' ) {
    return val.trim() === ''
  }
  return nullOrUndef(val)
}

export function equalsIgnoreCase(str1: string, str2: string) {
  return str1.toLowerCase() === str2.toLowerCase();
}

export function ignoreUnused(_value: any) {
  // do nothing
}
