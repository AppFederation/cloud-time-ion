/** https://stackoverflow.com/a/3976125/170451 */
import { debugLog } from './log'
import {equalsIgnoreCase} from './utils-from-oryol'

/* to consider: https://github.com/timdown/rangy - A cross-browser JavaScript range and selection library.
  but 2015; but there could be something similar more modern
 */

export function getCaretPosition(el: any) {
  var caretPos = 0,
    sel, range;
  // if ( el.tagName.toLowerCase() === 'input' ) {

  // } else
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel!.rangeCount) {
      range = sel!.getRangeAt(0);
      if (range.commonAncestorContainer.parentNode == el) {
        caretPos = range.endOffset;
      }
    }
  } // else if (document.selection && document.selection.createRange) {
  //   range = document.selection.createRange();
  //   if (range.parentElement() == el) {
  //     var tempEl = document.createElement("span");
  //     el.insertBefore(tempEl, el.firstChild);
  //     var tempRange = range.duplicate();
  //     tempRange.moveToElementText(tempEl);
  //     tempRange.setEndPoint("EndToEnd", range);
  //     caretPos = tempRange.text.length;
  //   }
  // }
  return caretPos;
}


export function getElementCaretPos(activeElement: any) {
  const element = <HTMLInputElement>activeElement
  const end = element.selectionEnd
  debugLog('getElementCaretPos', end)
  return end
}

export function getActiveElementCaretPos() {
  const elementCaretPos = getElementCaretPos(<HTMLInputElement>document.activeElement)
  debugLog('getActiveElementCaretPos', elementCaretPos)
  return elementCaretPos
}

export function isCaretAtEndOfActiveElement() {
  let activeElement = <HTMLInputElement> document.activeElement
  const isEnd = getElementCaretPos(activeElement) === ('' + activeElement.value).length
  return isEnd
}


export function getSelectionCursorState(/*nativeElement*/): { atEnd: boolean; atStart: boolean } {
  // const el = nativeElement
  const el = document.activeElement
  // debugLog('getSelectionCursorState', el.tagName, el)
  if ( equalsIgnoreCase('INPUT', el!.tagName) ) {
    return {
      atStart: getActiveElementCaretPos() === 0,
      atEnd: isCaretAtEndOfActiveElement(),
    }
  }

  var atStart = true, atEnd = false;
  var selRange, testRange;
  const selection = (document as any).selection
  if (window.getSelection) {
    var sel = window.getSelection();
    if (sel!.rangeCount) {
      selRange = sel!.getRangeAt(0);
      testRange = selRange.cloneRange();

      testRange.selectNodeContents(el as Node);
      testRange.setEnd(selRange.startContainer, selRange.startOffset);
      atStart = (testRange.toString() == "");

      testRange.selectNodeContents(el as Node);
      testRange.setStart(selRange.endContainer, selRange.endOffset);
      atEnd = (testRange.toString() == "");
    }
  } else if (selection && selection.type != "Control") {
    selRange = selection.createRange();
    testRange = selRange.duplicate();

    testRange.moveToElementText(el);
    testRange.setEndPoint("EndToStart", selRange);
    atStart = (testRange.text == "");

    testRange.moveToElementText(el);
    testRange.setEndPoint("StartToEnd", selRange);
    atEnd = (testRange.text == "");
  }

  const ret = {atStart: atStart, atEnd: atEnd}
  // debugLog('getSelectionCursorState start/end', ret)
  return ret
}
