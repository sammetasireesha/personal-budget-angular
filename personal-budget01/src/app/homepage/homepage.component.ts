import { Component, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscriber } from 'rxjs';
//import { Chart } from 'chart.js';
import { Chart } from 'chart.js/auto';

import * as d3 from 'd3';


@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit{
  public wid = 300;
  public hei = 300;
  public rad = Math.min(this.wid, this.hei) / 2;


  public dataSource = {
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




 constructor(private el: ElementRef, private http: HttpClient) {

 }
  ngOnInit(): void {
    this.http.get('http://localhost:3000/budget01')
    .subscribe((res: any ) => {

      console.log(res);
      for (var i = 0; i < res.data.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.data.myBudget[i].budget;
        this.dataSource.labels[i] = res.data.myBudget[i].title;
        this.createChart();
    }

    }
    );

  }
  renderPieChart(data: any[], width: number, height: number, radius: number): void {
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
 }

}
