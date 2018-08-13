import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class AppComponent implements OnInit, OnDestroy
{
  connected = false;

  connectedSubscription: Subscription;

  count = null;

  countSubscription: Subscription;

  data: any;

  fileName = '';

  fileNameSubscription: Subscription;

  interval;

  loading = true;

  nameOptions: SelectItem[] = Array.apply(null, Array(10)).map((x, index) =>
  {
    return { label: `Rat ${index + 1}`, value: `Rat${index + 1}` };
  });

  options = ChartOptions;

  ratName = '';

  signalDetectedDuringPoll = 0;

  testing = false;

  testingSubscription: Subscription;

  timeElapsed = '';

  timeStarted: moment.Moment;

  constructor(private socketService: SocketService)
  {
  }

  ngOnInit()
  {
    this.startSubscriptions();
    this.createChart();
    this.loadingAnimation();
  }

  ngOnDestroy()
  {
    if (this.connectedSubscription)
    {
      this.connectedSubscription.unsubscribe();
    }
    if (this.countSubscription)
    {
      this.countSubscription.unsubscribe();
    }
    if (this.fileNameSubscription)
    {
      this.fileNameSubscription.unsubscribe();
    }
    if (this.testingSubscription)
    {
      this.testingSubscription.unsubscribe();
    }
  }

  createChart()
  {
    this.data = {
      labels: Array.apply(null, Array(60)).map(x => ' '),
      datasets: [
        {
          label: 'Data',
          data: Array.apply(null, Array(60)).map(x => 0)
        }
      ]
    };
  }

  updateChartData()
  {
    this.data.datasets[0].data.pop();

    const newData = [];
    newData.push(this.signalDetectedDuringPoll, ...this.data.datasets[0].data);

    this.data = {
      labels: Array.apply(null, Array(30)).map(x => ''),
      datasets: [
        {
          data: newData
        }
      ]
    };

    this.signalDetectedDuringPoll = 0;
  }

  loadingAnimation()
  {
    setTimeout(() =>
    {
      this.loading = false;
    }, 3000);
  }

  start()
  {
    this.socketService.start(this.ratName);
  }

  startSubscriptions()
  {
    this.connectedSubscription = this.socketService.connected.subscribe(connected =>
    {
      this.connected = connected;
    });

    this.countSubscription = this.socketService.count.subscribe(count =>
    {
      if (this.count !== null)
      {
        this.signalDetectedDuringPoll = 1;
      }
      this.count = count;
    });

    this.fileNameSubscription = this.socketService.fileName.subscribe(filename =>
    {
      this.fileName = filename;
    });

    this.testingSubscription = this.socketService.testing.subscribe(testing =>
    {

      this.testing = testing;

      if (testing)
      {
        this.timeStarted = moment();

        this.interval = setInterval(() =>
        {

          this.timeElapsed = this.timeStarted.from(moment()).toString();
          this.updateChartData();

        }, 100);
      } else
      {
        this.count = null;
        clearInterval(this.interval);
        this.timeStarted = null;
      }


    });
  }

  stop()
  {
    this.socketService.stop();
  }

}
