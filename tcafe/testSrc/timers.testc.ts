import {Selector} from 'testcafe';

export function testTimers() {
  test(`Timers`, async t => {
    await t
      // .wait(2000)
      // .click('#fabAddTimer.hydrated')
      // .wait(2000)
      // .click('#fabAddTimer.hydrated')
      // .wait(2000)
      // .click('#fabAddTimer.hydrated')
      // .click('#fabAddTimer.hydrated')
      // // .click('#fabAddTimer.hydrated button')
      // .wait(3000)
      // .typeText("ion-icon", "TestCafe Timer " + new Date())
      // .wait(5000)
      // .click('#fabAddTimer.hydrated')
      // .click(Selector(() => document.querySelector('#fabAddTimer2.hydrated').shadowRoot.querySelector('button')))
      .click('#fabAddTimer')
      .typeText("#timerTitle input", "TestCafe Timer " + new Date())
      .click('#hoursPicker #buttonPlus')
      .click('#minutesPicker #buttonPlus')
      .click('#secondsPicker #buttonPlus')
      .click('#hoursPicker #buttonMinus')
      .click('#minutesPicker #buttonMinus')
      .click('#secondsPicker #buttonMinus')
      .click('#buttonStartTimer')
      .click('#buttonStopTimer')
      .click(Selector('.alert-button').withExactText("STOP"))
      .click('app-timer-details #buttonDeleteTimer')
      .click(Selector('.alert-button').withExactText("DELETE"))
      .click('#fabAddTimer') // another timer
      .click('app-timer-details #buttonDeleteTimer')
      .click(Selector('.alert-button').withExactText("DELETE"))
  })
}
