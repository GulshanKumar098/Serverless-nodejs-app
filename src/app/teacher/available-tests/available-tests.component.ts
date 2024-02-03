import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { HttpAPIService } from 'src/app/services/http-api.service';
import { environment } from 'src/environments/environment';

const HEADER_DATA: any[] = [
  { name: 'Test Name', key: 'testName' },
  { name: 'Test Link', key: 'testLink' }
]

@Component({
  selector: 'app-available-tests',
  templateUrl: './available-tests.component.html',
  styleUrls: ['./available-tests.component.css']
})
export class AvailableTestsComponent implements OnInit {
  userRole: string | null;
  data: any[];
  userToken: any;
  userData: any[];
  columns: any[] = HEADER_DATA;
  school_id: any;
  finalSchool_id: any;
  availableTestsArr:any = [];
  retakeTestdata:any = [];

  constructor(private adminService: AdminService, private service: HttpAPIService) {
    this.service.setShowLoader.next(true);
  }
  ngOnInit() {
    this.getUserDetails();
    this.getTeacherSchoolID();
  }
  getUserDetails() {
    this.userRole = localStorage.getItem('role');
    this.userToken = localStorage.getItem('access_token');
  }
  generateTestLink(school_id:any, test_id:any){
    return environment.QUIZ_URL+`/start/${school_id}/${test_id}`
  }

  getTeacherSchoolID() {
    this.adminService.get('school_id/teacher/' + this.userToken).subscribe({
      next: (response) => {
        this.service.setShowLoader.next(false);
        this.school_id = response;
        this.finalSchool_id = this.school_id.school_id
        this.getAvailableTests();
      }
    })
  }
  getAvailableTests() {
    this.adminService.get('tests/schools/'+this.finalSchool_id).subscribe({
      next: (response) => {
        // this.data = response;
      }
    })
        let test_ids : String = "1-7-3-4-2-6-5-9-68-10-11-12"
        let availableTestsObj = {
          testName : "Personal Development Quiz",
          testLink: `${this.generateTestLink(this.finalSchool_id, test_ids)}`,
        }
        this.availableTestsArr.push(availableTestsObj)
        this.data = this.availableTestsArr;
  }

}
