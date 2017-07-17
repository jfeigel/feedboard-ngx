import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as _ from 'lodash';
import * as io from 'socket.io-client';

import { environment } from '../../environments/environment';

@Injectable()
export class FeedService {
  public appObservable: Observable<any>;
  public activityObservable: Observable<any>;
  public rssObservable: Observable<any>;
  private _url = `${environment.host}:${environment.port}`;
  private numReady = 0;
  private _socket;
  private _appObserver: Observer<any>;
  private _activityObserver: Observer<any>;
  private _rssObserver: Observer<any>;


  constructor() {
    this._socket = io(this._url);

    this.appObservable = new Observable(observer => {
      this._appObserver = observer;
      this._socket.on('bootstrap', data => this._bootstrap(JSON.parse(data)));
      this._socket.on('restart', data => this._respond('restart', data, observer));
      return () => {
        this._socket.disconnect();
      };
    });

    this.activityObservable = new Observable(observer => {
      this._activityObserver = observer;
      this._socket.on('update', data => data.plugin !== 'rss' && this._respond('update', data, observer));
      return () => {
        this._socket.disconnect();
      };
    });

    this.rssObservable = new Observable(observer => {
      this._rssObserver = observer;
      this._socket.on('update', data => data.plugin === 'rss' && this._respond('update', data, observer));
      return () => {
        this._socket.disconnect();
      };
    });
  }

  public ready(): void {
    if (++this.numReady === 3) {
      this.connect();
    }
  }

  public connect(): void {
    this._socket.emit('bootstrap', 'init');
  }

  public sendMessage(name: string, data: any): void {
    this._socket.emit(name, data);
  }

  private _bootstrap(data: any): void {
    const [activity, rss] = _.partition(data, feedData => feedData.plugin !== 'rss');
    this._respond('bootstrap', activity, this._activityObserver);
    this._respond('bootstrap', rss, this._rssObserver);
  }

  private _respond(type: string, data: any, observer: Observer<any>): void {
    observer.next({
      type: type,
      data: data
    });
  }

}
