import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';


import embed, {Result} from 'vega-embed';


@Component({
  selector: 'stacked-interactive-chart',
  templateUrl: './stacked-interactive-chart.component.html',
  styleUrls: ['./stacked-interactive-chart.component.sass'],
})
export class StackedInteractiveChartComponent implements OnInit, OnChanges {

  @Input() spec: {} | null = null;  // https://vega.github.io/schema/vega-lite/v4.json
  @Input() data: {}[] = [];
  res: Result | null = null;

  constructor() { }

  ngOnInit() {
    this.reloadChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.spec) {
      this.reloadChart();
    }
    if(changes.data && this.res) {
      this.setData();
    }
  }

  public vegaLiteInit(spec: {} | null) {
    console.log('vega');
    // @ts-ignore
    embed(`#chart`, spec).then((res: Result) => {
      this.res = res;
      this.setData();
    });
  }

  public setData() {
    if (this.res) {
      this.res.view.insert('data', this.data).run()
    }
  }

  public reloadChart() {
    this.vegaLiteInit(this.spec);
  }
}
