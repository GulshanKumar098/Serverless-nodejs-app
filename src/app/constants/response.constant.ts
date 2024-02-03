import { ApexChart, ApexDataLabels,ApexPlotOptions, ApexStroke,  ApexMarkers,
  ApexResponsive, ApexTooltip, ApexAxisChartSeries, ApexXAxis, ApexGrid, ApexTitleSubtitle, ApexLegend, ApexFill, ApexYAxis, ApexNonAxisChartSeries} from 'ng-apexcharts';

  
export const responseMessage = {
  serverError:
    'there is an error while getting the data. please try again later',
};


export type testsTaken = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  legend:ApexLegend,
  plotOptions:ApexPlotOptions
  fill:ApexFill
  colors: String[];
  marker:ApexMarkers;
  tooltip:ApexTooltip;
  yaxis:ApexYAxis;
};
export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  colors: String[];
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  plotOptions:ApexPlotOptions 
  stroke: ApexStroke;
  marker:ApexMarkers;
  tooltip:ApexTooltip;
  responsive: ApexResponsive[];
  labels: any[];
};