import { environment } from '../environments/environment';
console.log(`Background start`);

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

chrome.runtime.onInstalled.addListener(() => {
});
