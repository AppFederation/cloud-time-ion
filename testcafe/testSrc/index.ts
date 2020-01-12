import {LOCALHOST_URL} from './utilsGlobal/globals';
import {resetRunNum, testRepetitions, testWrapper} from './utilsGlobal/testRunner';
import {logger, logRequests} from './utilsGlobal/requestLoggerUtils';
import {setLang} from './utilsGlobal/lang';

((fixture as any)/*.disablePageReloads*/ (`Fixture: OrYoL` ) as any)
  .page(LOCALHOST_URL)
  .requestHooks(logger)
  .before(async () => {
    /* reset here is important for TestCafe Live Mode */
    resetRunNum()
    setLang('es')
  })
  .beforeEach(async t => {
    console.log('beforeEach()')
    await t.maximizeWindow()
  });

// NOTE: Put fastest tests first, so that we see any failures quickly
const runAllTests = true

// TODO: have an option to run all without reloading page
// https://github.com/DevExpress/testcafe/issues/2850
// https://github.com/DevExpress/testcafe/issues/1770
// https://stackoverflow.com/questions/57370963/whats-the-progress-or-direction-on-disable-page-reloads-flag-in-testcafe

if ( runAllTests ) testWrapper('Log in via username & password', async () => {
  // https://devexpress.github.io/testcafe/documentation/test-api/authentication/user-roles.html

})

testRepetitions(() => {
  testWrapper('OrYoL test', async () => {
  })
})
