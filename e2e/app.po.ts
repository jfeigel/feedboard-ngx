import { browser, by, element } from 'protractor';

export class FeedboardNgPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('feed-root h1')).getText();
  }
}
