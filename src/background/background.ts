import { environment } from '../environments/environment';
console.log(`Background start`);

export const fakeExportToNotLookUnused = 'xyz'

// @ts-ignore
firebase.initializeApp(environment.firebaseConfig);

console.log(`Before listener`);

// auto login on startup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === 'login') {
                // @ts-ignore
                firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
                    .then((userCredential) => {
                            console.log(`Logged in: ${userCredential.user?.uid}`);
                            sendResponse(userCredential);
                    })
                    .catch((error) => {
                            console.log(`Sign in error: ${error}`);
                            sendResponse(error);
                    });
        }
  return true;
});

chrome.contextMenus.create({
        title: 'Add Task',
        id: 'addTask',
        contexts: ['selection']
});

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    // Only do stuff if it's your extension and it's getting tinymce
    if (details?.initiator?.indexOf(chrome.runtime.id) != -1 &&
      (details.url.indexOf("cdn.tiny.cloud") !== -1 || details.url.indexOf("sp.tinymce.com") !== -1)) {
      const newRef = "https://lifesuite.innotopic.com";
      let gotRef = false;
      // @ts-ignore
      for(let n = 0 ; n < details.requestHeaders?.length; n++){
        // @ts-ignore
        gotRef = details.requestHeaders[n].name.toLowerCase() === "referer";
        if(gotRef){
          // @ts-ignore
          details.requestHeaders[n].value = newRef;
          break;
        }
      }
      // If not already updated set to your approved domain
      if(!gotRef){
        details?.requestHeaders?.push({name: "Referer", value: newRef});
      }
    }
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestHeaders", "extraHeaders"]
);



chrome.runtime.onInstalled.addListener(() => {
});
