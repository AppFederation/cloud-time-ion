/** https://stackoverflow.com/a/3976125/170451 */
import { debugLog } from './log'

export function getCaretPosition(el) {
  var caretPos = 0,
    sel, range;
  // if ( el.tagName.toLowerCase() === 'input' ) {

  // } else
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0);
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


export function getElementCaretPos(activeElement) {
  const element = <HTMLInputElement>activeElement
  const end = element.selectionEnd
  debugLog('getElementCaretPos', end)
  return end
}

export function getActiveElementCaretPos() {
  return getElementCaretPos(<HTMLInputElement>document.activeElement)
}

export function isCaretAtEndOfActiveElement() {
  let activeElement = <HTMLInputElement> document.activeElement
  const isEnd = getElementCaretPos(activeElement) === ('' + activeElement.value).length
  return isEnd
}

export function getSelectionCursorState(nativeElement) {
  const el = nativeElement
  var atStart = true, atEnd = false;
  var selRange, testRange;
  const selection = (document as any).selection
  if (window.getSelection) {
    var sel = window.getSelection();
    if (sel.rangeCount) {
      selRange = sel.getRangeAt(0);
      testRange = selRange.cloneRange();

      testRange.selectNodeContents(el);
      testRange.setEnd(selRange.startContainer, selRange.startOffset);
      atStart = (testRange.toString() == "");

      testRange.selectNodeContents(el);
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
  console.log('start/end', ret)
  return ret
}
