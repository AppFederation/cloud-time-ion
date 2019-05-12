import { Selector } from 'testcafe';

export function testTimers() {
    test(`Timers`, async t => {
        await t.click('#fabAddTimer')
            .click('app-time-picker #buttonPlus')
        console.log('#secondsPicker ')
        // Selector('s')
    })
}
