import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import * as io from 'socket.io-client';
import Socket = SocketIOClient.Socket;

@Injectable({
  providedIn: 'root'
})
export class SocketService
{

  _connected = false;

  _count = 0;

  _fileName = '';

  _testing = false;

  connected: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  count: ReplaySubject<number> = new ReplaySubject<number>(1);

  fileName: ReplaySubject<string> = new ReplaySubject<string>(1);

  socket: Socket;

  testing: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  constructor()
  {
    this.onInit();
  }

  onInit()
  {
    this.socketConfiguration();
  }

  socketConfiguration(): void
  {
    this.socket = io('localhost:4200',
      {
        reconnection: true,
        reconnectionDelay: 500
      });

    this.socket.on('connected', () => {
      this._connected = true;
      this.connected.next(this._connected);
    });

    this.socket.on('disconnect', () =>
    {
      this._connected = false;
      this.connected.next(this._connected);
    });

    this.socket.on('started', data =>
    {
      this._testing = true;
      this.testing.next(this._testing);
      this._count = data.count;
      this.count.next(this._count);
      this._fileName = data.fileName;
      this.fileName.next(this._fileName);
    });

    this.socket.on('update', data =>
    {
      this._count = data;
      this.count.next(this._count);
    });

    this.socket.on('stopped', () =>
    {
      this._testing = false;
      this.testing.next(false);
    });
  }

  start(ratName: string)
  {
    this.socket.emit('start', ratName);
  }

  stop()
  {
    this.socket.emit('stop');
  }

}
