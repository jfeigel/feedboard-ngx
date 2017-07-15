import { Component, Input, OnInit } from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'feed-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  @Input() activities: any;

  constructor() { }

  ngOnInit() {
  }

  public formatTime(time): string {
    return moment(time).format('MMMM Do YYYY, h:mm:ss a');
  }

}
