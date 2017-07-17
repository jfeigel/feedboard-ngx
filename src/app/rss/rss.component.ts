import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { FeedService } from '../feed/feed.service';

@Component({
  selector: 'feed-rss',
  templateUrl: './rss.component.html',
  styleUrls: ['./rss.component.scss']
})
export class RssComponent implements OnInit {
  public connection: Subscription;
  public filters: any = {};
  public filteredData: any = {};
  public rss = [];

  constructor(
    private _feedService: FeedService
  ) { }

  ngOnInit() {
    this.connection = this._feedService.rssObservable.subscribe(res => {
      console.log(res.data);
    });

    this._feedService.ready();
  }

}
