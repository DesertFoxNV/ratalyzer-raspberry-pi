import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Animations } from '../assets/animations/animations';
import { SelectItem } from 'primeng/api';
import * as moment from 'moment';
import { ChartOptions } from '../helpers/chart-options';
import { SocketService } from '../services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [Animations.fadeIn]
})
export class AppComponent implements OnInit, OnDestroy {
  count = 0;

  connected = false;

  connectedSubscription: Subscription;

  countSubscription: Subscription;

  fileNameSubscription: Subscription;

  testingSubscription: Subscription;

  fileName = '';

  data: any;

  interval;

  loading = true;

  options = ChartOptions;

  testing = false;

  timeElapsed = '';

  timeStarted: any;

  victim: string;

  victimOptions: SelectItem[] = Array.apply(null, Array(10)).map((x, index) => {
    return { label: `Rat ${index + 1}`, value: `Rat${index + 1}` };
  });

  constructor(private socketService: SocketService) {
  }

  ngOnInit() {
    this.startSubscriptions();
    this.createChart();
    this.loadingAnimation();
  }

  ngOnDestroy() {
    if (this.connectedSubscription) { this.connectedSubscription.unsubscribe(); }
    if (this.countSubscription) { this.countSubscription.unsubscribe(); }
    if (this.fileNameSubscription) { this.fileNameSubscription.unsubscribe(); }
    if (this.testingSubscription) { this.testingSubscription.unsubscribe(); }
  }

  createChart() {
    this.data = {
      labels: Array.apply(null, Array(60)).map(x => ''),
      datasets: [
        {
          label: 'First Dataset',
          data: Array.apply(null, Array(60)).map(x => 0)
        }
      ]
    };

    this.generateRandomData();
  }

  generateRandomData() {
    setInterval(() => {
      this.data = {
        labels: Array.apply(null, Array(60)).map(x => ''),
        datasets: [
          {
            label: 'First Dataset',
            data: Array.apply(null, Array(60)).map(x => {
              return Math.round(Math.random());
            })
          }
        ]
      };
    }, 1000);
  }

  loadingAnimation() {
    setTimeout(() => {
      this.loading = false;
    }, 3000);
  }

  start() {
    this.socketService.start(this.victim);
  }

  startSubscriptions() {
    this.connectedSubscription = this.socketService.connected.subscribe(connected => {
      this.connected = connected;
    });

    this.countSubscription = this.socketService.count.subscribe(count => {
      this.count = count;
    });

    this.fileNameSubscription = this.socketService.fileName.subscribe(filename => {
      this.fileName = filename;
    });

    this.testingSubscription = this.socketService.testing.subscribe(testing => {

      this.testing = testing;

      this.timeStarted = moment();

      this.interval = setInterval(() => {
        this.timeElapsed = this.timeStarted.from(moment()).toString();
      }, 1000);
    });
  }

  stop() {
    clearInterval(this.interval);
    this.timeStarted = null;
  }

}
