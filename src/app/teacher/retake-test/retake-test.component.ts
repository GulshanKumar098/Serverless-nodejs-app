import { findIndex } from 'rxjs';
import { Component } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { environment } from 'src/environments/environment';
import { HttpAPIService } from 'src/app/services/http-api.service';

const RETAKE_DATA: any[] = [
  { name: 'Student Name', key: 'studentName' },
  { name: 'Test Name', key: 'testName' },
  { name: 'Test Link', key: 'testLink' }
]

@Component({
  selector: 'app-retake-test',
  templateUrl: './retake-test.component.html',
  styleUrls: ['./retake-test.component.css']
})

export class RetakeTestComponent {
  userRole: string | null;
  data: any[];
  userToken: any;
  userData: any[];
  columns: any[] = RETAKE_DATA;
  school_id: any;
  finalSchool_id: any;
  availableTestsArr:any = [];
  retakeTestdata:any = [];
  studentId:any;
  studentsData:any = [];

  constructor(private adminService: AdminService, private service: HttpAPIService) {
    this.service.setShowLoader.next(true);

  }
  ngOnInit() {
    this.getUserDetails();
    this.getTeacherSchoolID();
    //this.getStudentID();
  }
  getUserDetails() {
    this.userRole = localStorage.getItem('role');
    this.userToken = localStorage.getItem('access_token');
  }
  generateTestLink(school_id:any, test_id:any, studentId:any){
    return environment.QUIZ_URL+`/retake-test/${school_id}/${test_id}/${studentId}`
  }
  getTeacherSchoolID() {
    this.adminService.get('school_id/teacher/' + this.userToken).subscribe({
      next: (response) => {
        this.school_id = response;
        this.finalSchool_id = this.school_id.school_id;
        // this.getStudentID();
        this.getTableData()
      }
    })
  }

  getTableData() {
    this.adminService.get(`schools/${this.finalSchool_id}/results`).subscribe({
      next:(response: any)=>{
        this.service.setShowLoader.next(false);

        let test_ids : String = "1-7-3-4-2-6-5-9-68-10-11-12";

        // let availableTestsObj = {
        //   testName : "PSHE QUIZ",
        //   studentName: response[0].student.name,
        //   testLink: ,
        // }
        // this.availableTestsArr.push(availableTestsObj);

        response.sort((a: any, b: any) => a.test.id - b.test.id).forEach((data:any)=>{
          let i = this.availableTestsArr.findIndex((obj: any) => obj.studentName === data.student.name)
          if(i<0){
            this.availableTestsArr.push({
              testName: "Personal Development Quiz",
              studentName: data.student.name,
              testLink: `${this.generateTestLink(this.finalSchool_id, test_ids, data.student.id)}`
            })
          }
        })
        this.data = this.availableTestsArr
      },
      error: (error) => {
        this.service.setShowLoader.next(false);
      }
    })
  }
}
