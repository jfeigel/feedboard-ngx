import { Component, OnDestroy, OnInit } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';

import { FeedService } from './feed/feed.service';

@Component({
  selector: 'feed-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public title = 'Feedboard';
  public connection;
  public currentTime = moment().format('h:mm:ss a');
  public activities = [{name: 'GitHub', value: 'github'}];
  public filters: any = {};
  public filteredData: any = {};

  constructor(
    private _feedService: FeedService
  ) { }

  ngOnInit() {
    this.connection = this._feedService.observable.subscribe(res => {
      this[`_${res.type}`](res.data);
    });

    setInterval(() => {
      this.currentTime = moment().format('h:mm:ss a');
    }, 1000);

    this._feedService.connect();
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

  private _bootstrap(data) {
    const [activity, rss] = _.partition(JSON.parse(data), feedData => feedData.plugin !== 'rss');
    this._buildFilters(activity, rss);
    this.filteredData = {
      activity: activity,
      rss: rss
    };
  }

  private _restart(data) {
    console.log('Restart');
  }

  private _update(data) {
    console.log('Update');
  }

  private _buildFilters(activity: any[], rss: any[]): void {
    if (activity) {
      this.filters.activity = _.chain(activity)
        .map('plugin')
        .uniq()
        .sortBy()
        .value();
    }

    if (rss) {
      this.filters.rss = _.chain(rss)
        .map('provider')
        .uniq()
        .sortBy()
        .value();
    }
  }
}
