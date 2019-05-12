import { Selector } from 'testcafe';

export function testTimers() {
    test(`Timers`, async t => {
        await t.click('#fabAddTimer')
            .click('#hoursPicker #buttonPlus')
            .click('#minutesPicker #buttonPlus')
            .click('#secondsPicker #buttonPlus')
            .click('#hoursPicker #buttonMinus')
            .click('#minutesPicker #buttonMinus')
            .click('#secondsPicker #buttonMinus')
            .click('app-timer-details #buttonDeleteTimer')
            .click(Selector('.alert-button').withExactText("DELETE"))
    })
}
