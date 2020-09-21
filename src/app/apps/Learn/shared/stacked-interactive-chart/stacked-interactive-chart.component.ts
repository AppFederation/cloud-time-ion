import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';


import * as embed from 'vega-embed';


@Component({
  selector: 'stacked-interactive-chart',
  templateUrl: './stacked-interactive-chart.component.html',
  styleUrls: ['./stacked-interactive-chart.component.sass'],
})
export class StackedInteractiveChartComponent implements OnInit, OnChanges {

  @Input() spec: {} | null = null;  // https://vega.github.io/schema/vega-lite/v4.json

  constructor() { }

  ngOnInit() {
    this.reloadChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.spec) {
      this.reloadChart();
    }
  }

  public vegaLiteInit(spec: {} | null) {
    console.log('vega');
    // @ts-ignore
    embed(`#$chart`, spec).then();
  }

  public reloadChart() {
    this.vegaLiteInit(this.spec);
  }
}
