import { Injectable } from '@angular/core';


/**
 *
 * https://web.dev/idle-detection/
 *
 https://stackoverflow.com/questions/667555/how-to-detect-idle-time-in-javascript-elegantly
 https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event
 https://developer.mozilla.org/en-US/docs/Web/API/Window/pageshow_event
 "unload", "load"
 https://github.com/kidh0/jquery.idle
 https://stackoverflow.com/questions/19519535/detect-if-browser-tab-is-active-or-user-has-switched-away
 https://www.youtube.com/watch?v=cP2BsMhsldI
 https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API

 Visibility vs focus: ( want both)

 Developers have historically used imperfect proxies to detect this. For example, watching for blur and focus events on the window helps you know when your page is not the active page, but it does not tell you that your page is actually hidden to the user. The Page Visibility API addresses this.

 Note: While onblur and onfocus will tell you if the user switches windows, it doesn't necessarily mean it's hidden. Pages only become hidden when the user switches tabs or minimizes the browser window containing the tab.
 * */
@Injectable({
  providedIn: 'root'
})
export class UserIdleService {

  constructor() { }
}
