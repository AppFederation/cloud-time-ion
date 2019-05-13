import {testTimers} from "./timers.testc";

(fixture`CloudTime` as any)
// .disablePageReloads
    .page('localhost:4207')
    // .beforeEach(async t => {
    //     // logDebug('beforeEach(')
    //     // await dismissCookieLawViaCookie(t)
    // });


testTimers()
