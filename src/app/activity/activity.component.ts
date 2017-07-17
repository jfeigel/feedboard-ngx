import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';
import { Subscription } from 'rxjs/Subscription';

import { FeedService } from '../feed/feed.service';

@Component({
  selector: 'feed-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit, OnDestroy {
  public connection: Subscription;
  public currentTime = moment().format('h:mm:ss a');
  public currentPlugin = 'all';
  public activities: any[];
  public filters: any[];
  public filteredData: any[];

  constructor(
    private _feedService: FeedService
  ) { }

  ngOnInit() {
    this.connection = this._feedService.activityObservable.subscribe(res => {
      this[`_${res.type}`](res.data);
    });

    setInterval(() => {
      this.currentTime = moment().format('h:mm:ss a');
    }, 1000);

    this._feedService.ready();
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

  public formatTime(time): string {
    return moment(time).format('MMMM Do YYYY, h:mm:ss a');
  }

  public doFilter(): void {
    if (this.currentPlugin === 'all') {
      this.filteredData = this.activities;
    } else {
      this.filteredData = _.filter(this.activities, { plugin: this.currentPlugin });
    }
  }

  private _bootstrap(data: any): void {
    this.activities = data;
    this.filters = this._buildFilters(data);
    this.filteredData = data;
  }

  private _update(data: any): void {
    this.activities.unshift(data);
    this.activities = this.activities.slice(0, 25);

    this.filters = this._buildFilters(this.activities);
  }

  private _buildFilters(data: any): any {
    return _.chain(data)
      .map('plugin')
      .uniq()
      .sortBy()
      .value();
  }

}
