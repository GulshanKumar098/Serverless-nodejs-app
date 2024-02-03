import { Component, ViewChild } from '@angular/core';
import { ApexAxisChartSeries, ApexDataLabels, ApexFill, ApexGrid, ApexLegend, ApexMarkers, ApexPlotOptions, ApexStroke, ApexTitleSubtitle, ApexTooltip, 
  ApexXAxis, ApexYAxis, ChartComponent } from 'ng-apexcharts/public_api';
import { ApexNonAxisChartSeries, ApexResponsive, ApexChart } from "ng-apexcharts";
import { AdminService } from 'src/app/services/admin.service';
import * as moment from 'moment';
import { PieChartOptions, testsTaken } from '../../constants/response.constant';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  @ViewChild("teacherData") chart: ChartComponent;
  public testsTaken: Partial<testsTaken>;

  @ViewChild("studentsTests") pieChart: ChartComponent;
  public PieChartOptions: Partial<PieChartOptions>;

  data: any = null;  
  teacherData: any[]; 
  schoolsList:any[];
  testsData:any[];
  totalStudents:any[];
  testsTakenData:any = []; 
  totalTests: any = [];
  testsBarChartData: any = []
  testsBarChartLabel:any = [];
  //selectedDates = {startDate: moment().startOf('month').format("DD-MM-YYYY"), endDate:  moment().endOf('month').format("DD-MM-YYYY")}; 
  selectedDates = {startDate: moment().startOf('month'), endDate: moment().endOf('month')};
  alwaysShowCalendars: boolean;
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last 6 Months': [moment().subtract(6, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  } 
  monthData=[0,0,0,0,0,0,0,0,0,0,0,0];
  allYearGroups: any = [];
  yearGroups: any = [];

  constructor(private adminService : AdminService) {}
 
  ngOnInit(){ 
    this.totalTestsTaken(this.selectedDates.startDate,this.selectedDates.endDate);
    this.testsTakenBarchart();
    this.getYearGroup(this.selectedDates.startDate,this.selectedDates.endDate);
    this.getPiechartData();
    this.getTeachersList(); 
    this.getSchoolsList();
    this.getTestCount();
    this.getStudentCount();    
    
  }

  choosedDate(event:any){ 
    var newDate=JSON.stringify(this.selectedDates);         
    var jsonDate=JSON.parse(newDate);
    this.totalTestsTaken(moment.utc(jsonDate.startDate).subtract().format('YYYY-MM-DD'),moment.utc(jsonDate.endDate).subtract().format('YYYY-MM-DD'));
    this.getYearGroup(moment.utc(jsonDate.startDate).subtract().format('YYYY-MM-DD'),moment.utc(jsonDate.endDate).subtract().format('YYYY-MM-DD'));
    this.yearGroups = [];
  }
  getYearGroup(startDate:any,endDate:any){ 
    this.adminService.get('students?start_date='+moment.utc(startDate).subtract().format('YYYY-MM-DD')+'&end_date='+moment.utc(endDate).subtract().format('YYYY-MM-DD')).subscribe({
      next:(response)=>{ 
        this.yearGroups = [];
        this.allYearGroups= response 
        if(response && response.length > 0){
          let counted = []
          for (var c of this.allYearGroups) {
            const alreadyCounted:any = counted.map(c => c.year_group)
            if (alreadyCounted.includes(c.year_group)) {
              counted[alreadyCounted.indexOf(c.year_group)].count += 1
            } else {
              counted.push({ 'year_group': c.year_group, 'count': 1})
            }
          } 
          for(let i=0;i<counted.length;i++){
          this.yearGroups.push(counted[i].count)
        }
      }
      this.getPiechartData();
    }
    })
  }
  totalTestsTaken(startDate:any,endDate:any){
    this.adminService.get('tests-taken?start_date='+moment.utc(startDate).subtract().format('YYYY-MM-DD')+'&end_date='+moment.utc(endDate).subtract().format('YYYY-MM-DD')).subscribe({
      next:(response)=>{ 
        this.testsTakenData = response;
        if(response && response.length > 0){
          response.forEach((element:any) => {
            this.monthData[element.month-1] = element.test_count
          });
        }
        this.testsTakenBarchart();
        for(let i=0;i<this.testsTakenData.length;i++){
          this.testsBarChartData.push(this.testsTakenData[i].test_count);
          this.testsBarChartLabel.push(this.testsTakenData[i].month); 
        }
      }
    })
  }
 
  testsTakenBarchart(){
    this.testsTaken = {
      plotOptions: {
        bar: { columnWidth: '80%'}
      },
      colors: ["#976ec0"],
      stroke: {
        width: [0, 2, 5],
        curve: 'smooth'
      },
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
        toolbar: {
          show: false
        }
      },
      fill: {
        opacity: [0.85,0.25,1],
				gradient: {
					inverseColors: false,
					shade: 'light',
					type: "vertical",
					opacityFrom: 0.88,
					opacityTo: 0.60,
					stops: [0, 100, 100, 100]
				}
      },
      legend:{
        show: true,
        showForSingleSeries: true,
        showForNullSeries: true,
        showForZeroSeries: true,
        position: 'bottom',
        horizontalAlign: 'left',
        floating: false,
        fontSize: '14px',
        fontFamily: 'Inter, Arial',
        fontWeight: 400,
        formatter: undefined,
        inverseOrder: false,
        width: undefined,
        height: undefined,
        tooltipHoverFormatter: undefined,
        customLegendItems: [],
        offsetX: 0,
        offsetY: 0,
        itemMargin: {
            horizontal: 5,
            vertical: 0
        },
        onItemClick: {
            toggleDataSeries: true
        },
        onItemHover: {
            highlightDataSeries: true
        },
      },
      series: [{
        name: 'Tests taken',
        type: 'column',
        data: this.monthData
      }],

      dataLabels: {
        enabled: false
      },

      title: {
        text: "Total Number Of Tests Taken",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#fafafa", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: ["Jan", "Feb",  "Mar",  "Apr",  "May",  "Jun",  "Jul",  "Aug", "Sep","Oct","Nov","Dec"]
      },
      yaxis: {
        title: {
          text: 'Tests',
        },
        labels: {
          formatter: function(val) {
            return val.toFixed(0);
          }
        },
        min: 0
      },

    };
  }

  getPiechartData(){
    this.PieChartOptions = {
      series: this.yearGroups,
      colors: ["#336699", "#d14d96", "#976ec0"],
      chart: {
        width: 500,
        height: 350,
        type: "pie",
      },
      title: {
        text: "Pupil Year Groups",
        align: 'left',
        margin: 0,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize:  '14px',
          fontWeight:  'bold',
          fontFamily:  "Inter",
          color:  '#000'
        },
    },
    dataLabels: { 
      enabled: true,       
      textAnchor: 'middle',
      distributed: false,
      offsetX: 0,
      offsetY: 0,
      dropShadow: {
          enabled: false,
          top: 1,
          left: 1,
          blur: 1,
          color: '#000'
      }
    },
      labels: ["Year Group 5", "Year Group 6", "Year Group 7+"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            dropShadow: {
              enabled: true,
              left: 2,
              top: 2,
              opacity: 0.5
          },
          legend:{
            show: true,
            showForSingleSeries: false,
            showForNullSeries: true,
            showForZeroSeries: true,
            position: 'bottom',
            horizontalAlign: 'left',
            floating: false,
            fontSize: '14px',
            fontFamily: 'Inter, Arial',
            fontWeight: 400,
            formatter: undefined,
            inverseOrder: false,
            width: undefined,
            height: undefined,
            tooltipHoverFormatter: undefined,
            customLegendItems: [],
            offsetX: 0,
            offsetY: 0,
            itemMargin: {
                horizontal: 5,
                vertical: 0
            },
            onItemClick: {
                toggleDataSeries: true
            },
            onItemHover: {
                highlightDataSeries: true
            },
          },
            stroke: {
              width: [0, 2, 5],
              curve: 'smooth'
            },
          }
        }
      ]
    };   
  }
  getTeachersList(){ 
      this.adminService.get('teachers').subscribe({
        next:(response)=>{ 
          this.teacherData = response;
      }
      }) 
  }

  getStudentCount() {
    let startDate = '2022-01-01';
    let endDate = moment.utc(Date.now()).subtract().format('YYYY-MM-DD')
    this.adminService.get('students?start_date='+startDate+'&end_date='+endDate).subscribe({
      next:(response)=>{
        this.totalStudents = response; 
      }
    })
  }

  getTestCount(){
    this.adminService.get('tests').subscribe({
      next:(response)=>{
        this.testsData = response;
      }
    })
  }
  
  getSchoolsList(){
    this.adminService.get('schools').subscribe({
      next:(response)=>{
        this.schoolsList = response;
      }
    })
  }
}
