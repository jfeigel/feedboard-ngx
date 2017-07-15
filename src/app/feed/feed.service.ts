import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

import { environment } from '../../environments/environment';

@Injectable()
export class FeedService {
  public observable: Observable<any>;
  private _url = `${environment.host}:${environment.port}`;
  private _socket;

  constructor() {
    this._socket = io(this._url);

    this.observable = new Observable(observer => {
      this._socket.on('bootstrap', data => this._respond('bootstrap', data, observer));
      this._socket.on('restart', data => this._respond('restart', data, observer));
      this._socket.on('update', data => this._respond('update', data, observer));

      return () => {
        this._socket.disconnect();
      };
    });
  }

  connect() {
    this._socket.emit('bootstrap', 'init');
  }

  sendMessage(name, data) {
    this._socket.emit(name, data);
  }

  private _respond(type, data, observer) {
    observer.next({
      type: type,
      data: data
    });
  }

}
