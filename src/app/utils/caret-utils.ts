/** https://stackoverflow.com/a/3976125/170451 */
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
