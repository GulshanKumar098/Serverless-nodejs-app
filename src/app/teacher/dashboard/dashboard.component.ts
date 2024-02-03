import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { AdminService } from './../../services/admin.service';
import { ActionEvent } from 'src/app/interfaces/admin.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { modalConfig } from 'src/app/interfaces/common';
import { BarChartOptions, itemchartOptions } from '../constants/response.constant';
import { Observable, startWith } from "rxjs";
import { map } from "rxjs/operators";
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from "@angular/material/chips";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { HttpAPIService } from 'src/app/services/http-api.service';
import { DashboardService } from './dashboard.service';

const HEADER_DATA: any[] = [
  { name: 'Student Name', key: 'name' },
  { name: 'Year Group', key: 'year_group' }
];

@Component({
  selector: 'teacher-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  teachersListForm: FormGroup = new FormGroup({
    school_name: new FormControl(''),
    username: new FormControl(''),
    email: new FormControl(''),
  });
  columns: any[] = HEADER_DATA;
  tableData: any = null;
  data: any = [];
  filterData: any = null;
  studentName: any = [];
  actionEvent: ActionEvent;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  public itemchartOptions: Partial<itemchartOptions>;
  public BarChartOptions: Partial<BarChartOptions>;

  @ViewChild('viewTemplate') viewTemplate: TemplateRef<any>;
  isViewModel: boolean = true;
  modalRef: BsModalRef;

  students = new FormControl();
  selectedStudentsList: any = [];
  individualStudentData: any = [];
  previousResults: any;
  chartDisplaydata: any;
  newChartDataSet: any = [];
  schoolId: any;
  OriginalResponse: any[];

  filterStudentsData: any = null;

  filterValue: string;


  toCheckStudentListEmpty: []

  control = new FormControl();
  //streets: string[] = ['Champs-Élysées', 'Lombard Street', 'Abbey Road', 'Fifth Avenue'];
  filteredStudents: Observable<any[]>;
  @ViewChild('studentInput') studentInput: ElementRef<HTMLInputElement>;

  // The list of students ids that did not complete the quiz
  failedStudents: number[] = [];

  constructor(
    private adminService: AdminService,
    private modalService: BsModalService,
    private service: HttpAPIService,
    private dashboardService: DashboardService
  ) { }
  ngOnInit() {
    const userToken = localStorage.getItem('access_token');
    this.adminService.get('school_id/teacher/' + userToken).subscribe({
      next: (response) => {
        const school_id: any = response;
        this.schoolId = school_id?.school_id;
        this.getStudentsList();
        this.getStudentResultsApi();
      },
    });
  }

  public _filter(fvalue: any): any {
    fvalue = fvalue.value
    this.filterData = this.filterStudentsData?.filter((value: any) => {
      return this._normalizeValue(value.name).includes(fvalue?.toLowerCase());
    });
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase();
  }
  getStudentsList() {
    this.adminService
      .get(`students/schools?school_id=${this.schoolId}`)
      .subscribe({
        next: (response) => {
          // this.checkForResults(response)
          this.service.setShowLoader.next(false);
          this.tableData = response;
          this.filterData = response;
          this.filterStudentsData = response;
          this.filteredStudents = this.control.valueChanges.pipe(
            startWith(""),
            map((value: string | null) => (value ? this._filter(value || '') : this.filterStudentsData)),
          );
        },
        error: (error) => {
          this.service.setShowLoader.next(false);
        }
      });
  }

  checkForResults(studentResponse: any) {
    studentResponse.forEach(
      (s: any) => {
        this.service.generatePdf(`students/${s.id}/geeneratePdf`).subscribe({
          next: (response) => {
            // console.log(s.id)
          },
          error: (e) => {
            this.failedStudents.push(s.id)
          }
        })
      }
    )
    this.dashboardService.failedStudentsIds = this.failedStudents
  }

  openViewModel() {
    this.modalRef = this.modalService.show(this.viewTemplate, modalConfig);
  }
  openFormModal() {
    this.isViewModel = true;
    this.modalRef = this.modalService.show(this.viewTemplate, modalConfig);
  }
  actionEvents(event: ActionEvent) {
    let url = 'students/' + event.data.id + '/results';
    this.adminService.get(url).subscribe({
      next: (response) => {
        this.individualStudentData = response;
        var mark = 0;
        var name = '';
        var totalQuestion = 0;
        let previousMark = 0;
        this.individualStudentData.forEach((studentdataShow: any) => {
          if (
            studentdataShow &&
            studentdataShow?.answers &&
            studentdataShow?.answers?.length
          ) {
            studentdataShow?.answers?.forEach((element: any) => {
              if (element.mark && Number(element.mark)) {
                mark += element.mark;

              }
            });
            totalQuestion += studentdataShow?.answers?.length;
          }
          if (name != '') {
            previousMark = mark
          }
          name = studentdataShow?.student?.name;
        });
        this.chartDisplaydata = {
          name,
          //mark: [mark ? (mark * 100) / totalQuestion : 0, (previousMark * 100) / totalQuestion],
          mark: [mark ? (mark * 100) / totalQuestion : 0],
        };
        this.BarChartOptions = {
          series: [
            {
              name: "Marks %",
              data: this.chartDisplaydata.mark
            }
          ],
          colors: [
            "#008FFB",
          ],
          chart: {
            type: "bar",
            height: 350
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "40%",
            },
          },
          dataLabels: {
            enabled: true
          },
          stroke: {
            show: true,
            width: 2,
            colors: ["transparent"]
          },
          xaxis: {
            categories: [
              "Recent Scores"
            ]
          },
          yaxis: {
            title: {
              text: "Marks in %"
            },
            labels: {
              formatter: function (val) {
                return val.toFixed(0);
              }
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val.toFixed(2) + "";
              }
            }
          }
        };
      },
    });
    if (event.type === 'view') {
      this.openViewModel();
    }
  }

  getObjectsByFirstOccurrence(objects: any) {
    const seenValues = new Set();
    const list = [];

    for (const obj of objects) {
      const value = obj.student.id;

      if (!seenValues.has(value)) {
        seenValues.add(value);
        list.push(obj);
      }
    }
    return list; // If no object with the specified property value is found
  }

  filterChange() {
    if (this.selectedStudentsList && this.selectedStudentsList.length > 0) {
      var newFilter: any = [];
      var chartDataset: any = [];
      this.selectedStudentsList.forEach((element: any) => {
        var findData = this.filterData.find((item: any) => item.id === element);
        let response = this.OriginalResponse.filter(
          (item) => item.student.id === element
        ).reverse();
        // response = this.getObjectsByFirstOccurrence(response);
        response.forEach((element) => {
          var find = chartDataset.findIndex(
            (item: any) => item.testid === element.test.id
          );
          if (find < 0) {
            var markAnswer = 0;
            element?.answers.forEach((ans: any) => {
              markAnswer += ans.mark;
            });
            chartDataset.push({
              chartNameDisplay: element.test.name,
              testid: element.test.id,
              fail: 0,
              moderate: 0,
              merit: 0,
              student: [
                {
                  name: element.student.name,
                  id: element.student.id,
                  mark: markAnswer,
                  totalQuation: element?.answers?.length,
                  percentage: markAnswer
                    ? ((markAnswer * 100) / element?.answers?.length).toFixed(2)
                    : 0,
                },
              ],
            });
          } else {
            var markAnswer = 0;
            element?.answers.forEach((ans: any) => {
              markAnswer += ans.mark;
            });
            chartDataset[find].student.push({
              name: element.student.name,
              id: element.student.id,
              mark: markAnswer,
              totalQuation: element?.answers?.length,
              percentage: markAnswer
                ? ((markAnswer * 100) / element?.answers?.length).toFixed(2)
                : 0,
            });
          }
        });
        newFilter.push(findData);
      });
      this.tableData = newFilter;
      this.getStudentMarks(chartDataset);
    } else {
      this.tableData = this.filterData;
      this.getStudentResultsApi();
    }
  }

  getStudentResultsApi() {
    this.adminService.get(`schools/${this.schoolId}/results`).subscribe({
      next: (response) => {
        var chartDataset: any = [];
        response.forEach((element) => {
          var find = chartDataset.findIndex(
            (item: any) => item.testid === element.test.id
          );
          if (find < 0) {
            var markAnswer = 0;
            element?.answers.forEach((ans: any) => {
              markAnswer += ans.mark;
            });
            chartDataset.push({
              chartNameDisplay: element.test.name,
              testid: element.test.id,
              fail: 0,
              moderate: 0,
              merit: 0,
              student: [
                {
                  name: element.student.name,
                  id: element.student.id,
                  mark: markAnswer,
                  totalQuation: element?.answers?.length,
                  percentage: markAnswer
                    ? ((markAnswer * 100) / element?.answers?.length).toFixed(2)
                    : 0,
                },
              ],
            });
          } else {
            var markAnswer = 0;
            element?.answers.forEach((ans: any) => {
              markAnswer += ans.mark;
            });
            chartDataset[find].student.push({
              name: element.student.name,
              id: element.student.id,
              mark: markAnswer,
              totalQuation: element?.answers?.length,
              percentage: markAnswer
                ? ((markAnswer * 100) / element?.answers?.length).toFixed(2)
                : 0,
            });
          }
        });
        this.OriginalResponse = response;
        this.getStudentMarks(chartDataset);
      },
    });
  }
  add(event: MatChipInputEvent): void {

  }


  remove(id: any): void {
    const index = this.selectedStudentsList.indexOf(id);
    if (index >= 0) {
      this.selectedStudentsList.splice(index, 1);
      this.filterStudentsData.push(this.filterData[this.filterData.map((value: any) => value.id).indexOf(id)]);
    }
    this.filterChange();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedStudentsList.push(event.option.value);
    this.studentInput.nativeElement.value = '';
    this.control.setValue(null);
    let index = this.filterStudentsData.map((value: any) => value.id).indexOf(event.option.value);
    if (index >= 0) {
      this.filterStudentsData = this.filterStudentsData.filter((value: any, i: any) => i !== index);
    }
    this.filterChange();
  }

  fetchName(id: number): any {
    return this.filterData.filter((student: any) => student.id === id)[0].name;
  }
  getStudentMarks(chartDataset: any[]) {
    chartDataset.forEach((chartset: any, index: any) => {
      var fail = 0;
      var moderate = 0;
      var merit = 0;
      var total = 0;
      chartset?.student?.forEach((elementStud: any) => {
        if (parseFloat(elementStud.percentage) >= 76) {
          merit += 1;
        } else if (
          parseFloat(elementStud.percentage) >= 50 &&
          parseFloat(elementStud.percentage) < 76
        ) {
          moderate += 1;
        } else {
          fail += 1;
        }
        total += 1;
      });
      chartDataset[index].fail = fail ? ((fail * 100) / total).toFixed(2) : 0;
      chartDataset[index].moderate = moderate
        ? ((moderate * 100) / total).toFixed(2)
        : 0;
      chartDataset[index].merit = merit
        ? ((merit * 100) / total).toFixed(2)
        : 0;
    });
    this.newChartDataSet = [];

    chartDataset.forEach((setData: any) => {
      this.newChartDataSet.push({
        name: setData.chartNameDisplay,
        series: [
          parseFloat(setData.fail),
          parseFloat(setData.moderate),
          parseFloat(setData.merit),
        ],
        chart: {
          width: '340',
          height: 400,
          type: 'donut',
        },
        colors: ['#CB4335', '#FF8927', '#54DF20'],
        theme: {
          monochrome: {
            enabled: true
          }
        },
        // plotOptions: {
        //   pie: {
        //     customScale: 1,
        //     donut: {
        //       fontSize: '6px',
        //       fontWeight: 500,
        //       // labels: {
        //       //   show: true,
        //       //   total: {
        //       //     showAlways: false,
        //       //     show: true
        //       //   },
        //       //   name: {
        //       //     setData
        //       //   },
        //       //   value: {
        //       //     chartDataset
        //       //   }
        //       // }
        //     }
        //   }
        // },

        labels: [
          'I require more support',
          'I have good knowledge',
          'I have excellent knowledge',
        ],
        //removed DataLabels
        dataLabels: {
          enabled: false
        },
        //removed tooltip data values
        tooltip: {
          enabled: true,
          enabledOnSeries: true,
          shared: true,
          followCursor: true,
          custom: true,
          fillSeriesColor: true,
          theme: true,
          style: {
            fontSize: '12px',
            fontFamily: 'Inter'
          },
          onDatasetHover: {
            highlightDataSeries: true,
          },
          x: {
            show: true,
          },
          marker: {
            show: true,
          }
        },
        legend: {
          show: true,
          position: 'bottom',
          showForSingleSeries: true,
          showForNullSeries: true,
          showForZeroSeries: true,
          horizontalAlign: 'left',
          floating: false,
          fontSize: '10px',
          fontFamily: 'Inter',
          fontWeight: 400,
          formatter: undefined,
          width: undefined,
          height: undefined,
          tooltipHoverFormatter: false,
          customLegendItems: [],
          offsetX: 30,
          offsetY: 0,
        },
        responsive: [
          {
            breakpoint: 450,
            options: {
              legend: {
                show: true,
                showForSingleSeries: false,
                showForNullSeries: true,
                showForZeroSeries: true,
                position: 'top',
                horizontalAlign: 'left',
                floating: true,
                fontSize: '12px',
                fontFamily: 'Inter',
                fontWeight: 400,
                formatter: undefined,
                inverseOrder: false,
              },
            },
          },
        ],
      });
    });

  }
}