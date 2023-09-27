import { Component, ElementRef, OnInit,AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscriber } from 'rxjs';
//import { Chart } from 'chart.js';
import { Chart, ChartOptions, ChartDataset } from 'chart.js/auto';
import { DataService } from '../data.service';

import * as d3 from 'd3';
import { PieArcDatum } from 'd3';

interface BudgetItem {
  title: string;
  budget: number;
}

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, AfterViewInit, OnDestroy{
  public chartJsData: {
    datasets: ChartDataset[];
    labels: string[];
  } = {

    datasets: [
        {
            data: [30, 40, 50],
            backgroundColor: [
                '#ffcd56',
                '#ff6384',
                '#36a2eb',
                '#fd6b19',
            ],
        }
    ],
    labels: [
        'Eat out',
        'Rent',
        'Groceries'
    ]
};
myChartJsPieChart: Chart | undefined;
d3Data: BudgetItem[] = [];



 //constructor(private el: ElementRef, private http: HttpClient) {

 //}
 constructor(private dataService: DataService) { }

  //ngOnInit(): void {
    //this.http.get('http://localhost:3000/budget01')
    //.subscribe((res: any ) => {

      //console.log(res);
      //for (var i = 0; i < res.data.myBudget.length; i++) {
        //this.dataSource.datasets[0].data[i] = res.data.myBudget[i].budget;
        //this.dataSource.labels[i] = res.data.myBudget[i].title;
        //this.createChart();
    //}

    //}
    //);

  //}

  ngOnInit(): void {
    // Load data for Chart.js pie chart
    this.dataService.getData().subscribe(res => {
      console.log(res);
         for (let i = 0; i < res.length; i++) {
           this.chartJsData.datasets[0].data[i] = res[i].budget;
           this.chartJsData.labels[i] = res[i].title;
         }
         this.createChartJsPieChart();
         this.d3Data = res;
         this.renderD3DoughnutChart();
      });

    // Load data for D3.js doughnut chart
  }

  /**renderPieChart(data: any[], width: number, height: number, radius: number): void {
    const svg = d3
      .select(this.el.nativeElement.querySelector('#pie-chart-container')) // Select the specified HTML element by ID
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const pie = d3.pie();
    debugger;
    const arcs = pie(data);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    svg
      .selectAll('path')
      .data(arcs)
      .enter()
      .append('path')
      .attr('d', (d: any) => arc(d) as string)
      .attr('fill', (d, i) => color(i.toString()));
  }
  createChart() {
    //var ctx = document.getElementById("myChart").getContext("2d") as HTMLImageElement;
    var ctx = document.getElementById("myChart") as HTMLCanvasElement;
    ctx.width =450;
    ctx.height = 450;
    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource
    });
 } **/
 createChartJsPieChart() {
  setTimeout(() => {
    const ctx = document.getElementById("myChart") as HTMLCanvasElement;

    if (!ctx) {
      console.error('Canvas element not found.');
      return;
    }

    if (this.myChartJsPieChart) {
      this.myChartJsPieChart.destroy();
    }

    try {
      this.myChartJsPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.chartJsData,
        options: {
          responsive: false,
          maintainAspectRatio: false,
        } as ChartOptions
      });
    } catch (error) {
      console.error('Error creating Chart.js pie chart:', error);
    }
  });
}

renderD3DoughnutChart() {
  const width = 450,
    height = 450,
    margin = 40;

  const radius = Math.min(width, height) / 2 - margin;

  const svg = d3
    .select("#doughnut_chart_d3")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  const data = this.d3Data;

  const color = d3.scaleOrdinal<string>()
    .domain(data.map(d => d.title))
    .range(d3.schemeDark2);

  const pie = d3.pie<BudgetItem>()
    .sort(null)
    .value(d => d.budget);

  const dataReady = pie(data);

  const arc = d3.arc<PieArcDatum<BudgetItem>>()
    .innerRadius(radius * 0.5)
    .outerRadius(radius * 0.8);

  const outerArc = d3.arc<PieArcDatum<BudgetItem>>()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

  svg.selectAll("allSlices")
    .data(dataReady)
    .enter()
    .append("path")
    .attr("d", d => arc(d) as string)
    .attr("fill", d => color(d.data.title))
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.7);

  svg.selectAll("allPolylines")
    .data(dataReady)
    .enter()
    .append("polyline")
    .attr("stroke", "black")
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr("points", d => {
      const posA = arc.centroid(d) as [number, number];
      const posB = outerArc.centroid(d) as [number, number];
      const posC = outerArc.centroid(d) as [number, number];
      const midangle = (d as any).startAngle + ((d as any).endAngle - (d as any).startAngle) / 2;
      posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
      return `${posA},${posB},${posC}`;
    });

  svg.selectAll("allLabels")
    .data(dataReady)
    .enter()
    .append("text")
    .text(d => d.data.title)
    .attr("transform", d => {
      const pos = outerArc.centroid(d) as [number, number];
      const midangle = (d as any).startAngle + ((d as any).endAngle - (d as any).startAngle) / 2;
      pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
      return `translate(${pos})`;
    })
    .style("text-anchor", d => {
      const midangle = (d as any).startAngle + ((d as any).endAngle - (d as any).startAngle) / 2;
      return midangle < Math.PI ? "start" : "end";
    });
}

ngAfterViewInit(): void {
  // Leave this empty for now
}

ngOnDestroy(): void {
  if (this.myChartJsPieChart) {
    this.myChartJsPieChart.destroy();
  }
}

}
