import { OryolPage } from './app.po';

describe('oryol App', () => {
  let page: OryolPage;

  beforeEach(() => {
    page = new OryolPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
