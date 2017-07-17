import { Component, OnDestroy, OnInit } from '@angular/core';

import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';

import { FeedService } from './feed/feed.service';

@Component({
  selector: 'feed-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public title = 'Feedboard';
  public connection: Subscription;

  constructor(
    private _feedService: FeedService
  ) { }

  ngOnInit() {
    this.connection = this._feedService.appObservable.subscribe(res => {
      this[`_${res.type}`](res.data);
    });

    this._feedService.ready();
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

  private _restart(data) {
    console.log('Restart');
  }
}
