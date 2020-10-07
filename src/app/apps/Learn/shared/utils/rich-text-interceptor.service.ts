import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RichTextInterceptorService {

  constructor() { }

  public intercept(callback: ((result: any[]) => void) | undefined) {
    chrome.tabs.executeScript( { code: `
    var fragment = window.getSelection().getRangeAt(0).cloneContents();
    var div = document.createElement('div');
    div.appendChild(fragment.cloneNode(true));
    div.innerHTML`}, callback);
  }
}
