export const ChartOptions = {
  animation: {
    duration: 0
  },
  legend: {
    display: false
  },
  scales: {
    xAxes: [{
      display: false
    }],
    yAxes: [{
      ticks: {
        min: 0,
        max: 1.05
      },
      display: false
    }]
  },
  tooltips: {
    enabled: false
  },
  elements: { point: { radius: 0 } }
};
