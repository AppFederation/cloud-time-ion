import {ClientFunction, Selector, t} from 'testcafe';

/** https://testcafe-discuss.devexpress.com/t/how-do-you-validate-url-in-testcafe/640 */
export const getWindowDocumentLocation = ClientFunction(() => document.location.href);

export const getWindowDocumentTitle = ClientFunction(() => document.title);

export async function expectExactTextExists(text: string) {
  await t.expect(Selector(`*`).withExactText(text).exists).ok(`Expecting exact text to exist: ${text}`,
    { timeout: 20*1000 }
    )
}

export async function clickText(text: string) {
  await t.click(Selector(`*`).withText(text))
}

export async function typeText(
  selector: string | Selector,
  text: string,
  options?: TypeActionOptions)
{
  await t.typeText(selector, text, { ... options, paste: true } )
}

export async function clickButton(buttonTitle: string) {
  // note: material buttons have the text in span; but maybe better to use button ... find ... withText
  await t.click(Selector('button:enabled span').withText(buttonTitle));
}

export async function clickSpanWithText (textContent: string) {
  await t.click(Selector('span').withText(textContent))
}

export async function reloadPage() {
  await t.eval(() => location.reload(true)); // https://testcafe-discuss.devexpress.com/t/how-to-trigger-a-page-reload/542
}
