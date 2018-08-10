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

  signalDetectedDuringPoll = 0;

  testing = false;

  timeElapsed = '';

  timeStarted: moment.Moment;

  victim = '';

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
  }

  updateChartData() {
      const newData = [this.signalDetectedDuringPoll].push(...this.data.datasets[0].splice(-1, 1));

      this.data = {
        labels: Array.apply(null, Array(60)).map(x => ''),
        datasets: [
          {
            data: newData
          }
        ]
      };

    this.signalDetectedDuringPoll = 0;
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

      this.signalDetectedDuringPoll = 1;
    });

    this.fileNameSubscription = this.socketService.fileName.subscribe(filename => {
      this.fileName = filename;
    });

    this.testingSubscription = this.socketService.testing.subscribe(testing => {

      this.testing = testing;

      if (testing) {
        this.timeStarted = moment();

        this.interval = setInterval(() => {

          this.timeElapsed = this.timeStarted.from(moment()).toString();
          this.updateChartData();

        }, 1000);
      } else {
        clearInterval(this.interval);
        this.timeStarted = null;
      }


    });
  }

  stop() {
    this.socketService.stop();
  }

}
