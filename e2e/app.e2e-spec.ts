import { FeedboardNgPage } from './app.po';

describe('feedboard-ngx App', () => {
  let page: FeedboardNgPage;

  beforeEach(() => {
    page = new FeedboardNgPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('feed works!');
  });
});
