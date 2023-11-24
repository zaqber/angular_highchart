import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import * as Highcharts from 'highcharts';
import { interval } from 'rxjs';
import HighchartsBoost from 'highcharts/modules/boost';
HighchartsBoost(Highcharts);
import HC_map from "highcharts/modules/map";
HC_map(Highcharts);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Line Chart with HighCharts in Angular';

  constructor(private httpService: HttpClient) { }

  public arrSales: any[] = [];
  public chartOptions: Highcharts.Options = {
    chart: {
      type: 'line',
      zooming: {
        type: 'xy'
      },
      backgroundColor: '#0303047d',
      height: 300,
    },
    credits: {
      enabled: false,
    },
    boost: {
      useGPUTranslations: true,
      usePreallocated: false,
      seriesThreshold: 1,
    },
    mapNavigation: {
      enableMouseWheelZoom: true
    },
    title: {
      text: 'Highcharts drawing n points',
    },
    plotOptions: {
      series: {
        animation: false,
        cursor: 'pointer',
        className: 'popup-on-click',
        marker: {
          lineWidth: 1,
        },
      },
    },
    subtitle: {
      text: 'Using the Boost module',
    },
    tooltip: {
      shared: true,
      valueDecimals: 2,
    },
    xAxis: [
      {
        type: 'category',
        labels: {
          style: {
            color: 'whitesmoke',
          },
        },
        crosshair: true,
      },
    ],
    yAxis: [
      {
        title: {
          text: 'A(kg)',
          style: {
            color: '#a3f080',
          },
        },
        labels: {
          format: '{value} kg',
          style: {
            color: '#a3f080',
          },
        },
      },
      {
        className: 'temp',
        labels: {
          format: '{value}ml',
          style: {
            color: '#a6d1ff',
          },
        },
        title: {
          text: 'B(ml)',
          style: {
            color: '#a6d1ff',
          },
        },
        opposite: true,
      },
      {
        title: {
          text: 'C(m)',
          style: {
            color: 'orange',
          },
        },
        labels: {
          format: '{value} m',
          style: {
            color: 'orange',
          },
        },
        opposite: true,
      },
    ],
  };

  ngOnInit() {
    // 初始执行一次
    this.getData();

    // 每隔10秒执行一次
    interval(10000).subscribe(() => {
      this.getData();
    });
  }


  getData() {
    this.httpService
      .get('./assets/sales-data.json', { responseType: 'json' })
      .subscribe(
        (data: any) => {
          this.arrSales = data;
          this.showChart();
        },
        (err: HttpErrorResponse) => {
          console.log(err.message);
        }
      );
  }

  showChart() {
    const seriesData = this.arrSales[0];
    const seriesA = seriesData['A'];
    const seriesB = seriesData['B'];
    const seriesC = seriesData['C'];
    const seriesTime = seriesData['Time'];

    this.chartOptions.xAxis = { categories: seriesTime };
    this.chartOptions.series = [
      {
        name: 'A',
        type: 'line',
        yAxis: 0,
        boostThreshold: 1,
        turboThreshold: 1,
        data: seriesA ? seriesA : [],
      },
      {
        name: 'B',
        type: 'line',
        yAxis: 1,
        boostThreshold: 1,
        turboThreshold: 1,
        data: seriesB ? seriesB : [],
      },
      {
        name: 'C',
        type: 'line',
        yAxis: 2,
        boostThreshold: 1,
        turboThreshold: 1,
        data: seriesC ? seriesC : [],
      },
    ];

    Highcharts.chart('div-container', this.chartOptions);

  }
}
