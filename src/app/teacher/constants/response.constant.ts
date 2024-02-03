import { ApexNonAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexStroke, ApexMarkers,
  ApexResponsive, ApexTooltip, ApexLegend, ApexAxisChartSeries, ApexYAxis, ApexXAxis, ApexFill
} from 'ng-apexcharts';

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions
  stroke: ApexStroke;
  marker: ApexMarkers;
  colors: String[];
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];
  labels: any;
  legend: ApexLegend;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
};
export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions
  stroke: ApexStroke;
  marker: ApexMarkers;
  colors: String[];
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];
  labels: any;
  legend: ApexLegend;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
};

export type itemchartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions
  stroke: ApexStroke;
  marker: ApexMarkers;
  colors: String[];
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];
  labels: any;
  legend: ApexLegend;
}; 

 