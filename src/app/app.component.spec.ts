import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { SocketService } from '../services/socket.service';
import { ChartModule, DropdownModule } from 'primeng/primeng';
import { LoadingComponent } from './loading/loading.component';
import { FormsModule } from '@angular/forms';
import { ChartOptions } from '../helpers/chart-options';

class SocketServiceStub {
}

describe('AppComponent', () => {
  let component: AppComponent,
    fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ChartModule,
        DropdownModule,
        FormsModule
      ],
      declarations: [
        AppComponent,
        LoadingComponent,
      ],
      providers: [
        { provide: SocketService, useClass: SocketServiceStub },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should have the required functions', () => {
    const methods = [
      'ngOnInit', 'ngOnDestroy', 'createChart', 'updateChartData', 'loadingAnimation', 'start', 'startSubscriptions',
      'stop'
    ];

    for (const method of methods) {
      expect(typeof component[method]).toBe('function');
    }
  });

  it('starting properties should match expected values', () => {
    expect(component.count).toBe(null);
    expect(component.connected).toBe(false);
    expect(component.connectedSubscription).toBe(undefined);
    expect(component.countSubscription).toBe(undefined);
    expect(component.fileNameSubscription).toBe(undefined);
    expect(component.testingSubscription).toBe(undefined);
    expect(component.fileName).toBe('');
    expect(component.data).toBe(undefined);
    expect(component.interval).toBe(undefined);
    expect(component.loading).toBe(true);
    expect(component.options).toBe(ChartOptions);
    expect(component.signalDetectedDuringPoll).toBe(0);
    expect(component.testing).toBe(false);
    expect(component.timeElapsed).toBe('');
    expect(component.timeStarted).toBe(undefined);
    expect(component.ratName).toBe('');

    for (let i = 0; i < 9; i++) {
      expect(component.nameOptions[i]).toEqual({label: `Rat ${i + 1}`, value: `Rat${i + 1}`});
    }

  });
});
