// import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
//
//
// import embed, {Result} from 'vega-embed';
// import {updateSpitter} from './color-gradient'
// import {Dictionary} from '../../../../libs/AppFedShared/utils/dictionary-utils'
//
//
// interface SeriesData {
//   series: string;
//   count: number,
//   date: Date,
// }
//
//
// interface VegaLiteEncodingPoint {
//   field?: string,
//   type?: string,
//   scale?: Dictionary<any>,
//   axis?: Dictionary<any>,
// }
//
//
// interface VegaLiteVconcat {
//   width?: number | string /* | 'container'*/,
//   mark: string,
//   encoding: {
//     x?: VegaLiteEncodingPoint,
//     y?: VegaLiteEncodingPoint,
//     color?: VegaLiteEncodingPoint,
//   }
// }
//
//
// interface VegaLiteSchema {
//   "$schema": string,
//   data: {},
//   vconcat: VegaLiteVconcat[],
// }
//
// const DEMO_CHART = {
//   "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
//   // "data": {"url": "assets/unemployment-across-industries.json"},
//   // "data": {"values": Array.from(dataToSingleValues(dataGenerator(30, new Date().getTime() / 1000)))},
//   "data": {"name": "data", "values": []},
//   "vconcat": [{
//     "width": "container",
//     "mark": "area",
//     "encoding": {
//       "x": {
//         "field": "date",
//         "type": "temporal",
//         "scale": {"domain": {"selection": "brush"}},
//         "axis": {"title": ""}
//       },
//       "y": {"field": "count", "aggregate": "sum"},
//     }
//   }, {
//     "width": "container",
//     "height": 60,
//     "mark": "area",
//     "selection": {
//       "brush": {"type": "interval", "encodings": ["x"]}
//     },
//     "encoding": {
//       "x": {
//         "field": "date",
//         "type": "temporal"
//       },
//       "y": {
//         "field": "count",
//         "aggregate": "sum",
//       },
//     }
//   }]
// }
//
//
//
// @Component({
//   selector: 'stacked-interactive-chart',
//   templateUrl: './stacked-interactive-chart.component.html',
//   styleUrls: ['./stacked-interactive-chart.component.sass'],
// })
// export class StackedInteractiveChartComponent implements OnInit, OnChanges {
//
//   // @Input() spec: {} | null = null;  // https://vega.github.io/schema/vega-lite/v4.json
//   @Input() data: SeriesData[] = [];
//   @Input() undefinedColor: string = '#dedede';
//   @Input() firstColor: string = '#0000ff';
//   @Input() lastColor: string = '#ff3300';
//   res: Result | null = null;
//   spec: VegaLiteSchema = DEMO_CHART;
//
//   constructor() { }
//
//   ngOnInit() {
//     this.reloadChart();
//   }
//
//   ngOnChanges(changes: SimpleChanges) {
//     if(changes.data && this.res) {
//       // this.setData();
//       this.reloadChart();
//     }
//   }
//
//   public vegaLiteInit(spec: {} | null) {
//     // @ts-ignore
//     embed(`#chart`, spec).then((res: Result) => {
//       this.res = res;
//       this.setData();
//     });
//   }
//
//   public seriesNames() {
//     return this.data.map((data: SeriesData) => data.series).filter((thing: string, i: number, arr: string[]) => {
//       return arr.indexOf(<string>arr.find(t => t === thing)) === i;
//     });
//   }
//
//   public getEncodingColor() {
//     const seriesNames = this.seriesNames()
//     let seriesCount: number = seriesNames.length;
//     let range: string[] = [];
//     if(seriesNames.indexOf('-') >= -1) {
//       // undefined in seriesNames
//       range.push(this.undefinedColor);
//       seriesCount -= 1;
//     }
//     range = range.concat(updateSpitter(this.firstColor, this.lastColor, seriesCount));
//     return {
//       "field": "series",
//       "scale": {"range": range}
//     }
//   }
//
//   public setData() {
//     if (this.res) {
//       this.res.view.insert('data', this.data).run()
//       // this.reloadChart();
//     }
//   }
//
//   public reloadChart() {
//     // TODO: refactor vconcats
//     this.spec.vconcat[0].encoding.color = this.getEncodingColor();
//     this.spec.vconcat[1].encoding.color = this.getEncodingColor();
//     this.vegaLiteInit(this.spec);
//   }
// }
