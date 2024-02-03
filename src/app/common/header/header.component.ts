import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; 
import { AdminService } from 'src/app/services/admin.service';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpAPIService } from 'src/app/services/http-api.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent { 
  private loggedIn = new BehaviorSubject<boolean>(false);
  @Output() isExpend = new EventEmitter();
  isHeaderExpand:boolean=true;
  userRole: string | null;
  data: any;
  userToken: any;
  userData:any[]; 
  headerUserName:any;

  constructor(private authService: AuthService,private adminService : AdminService, 
              private toastr: ToastrService, private router: Router,private http: HttpClient, private service: HttpAPIService) { }

  ngOnInit() {
    this.userRole = localStorage.getItem('role');
    this.getUserDetails();
  }
  getUserDetails(){
    let url = environment.API_BASE_URL+'profile/'
    this.userToken = localStorage.getItem('access_token');
    this.adminService.get('profile?token='+this.userToken).subscribe({
      next:(response)=>{
        this.service.setShowLoader.next(false);
        this.data = response;
        let userName = this.data.username
        if(userName.includes('@')){
          this.headerUserName = userName.substring(0, userName.lastIndexOf("@"));
        }else{
          this.headerUserName = userName
        }
 
      //   let userProfileArray:any= [];
      //   for (let i = 0; i < this.data.length; i++) {
      //     debugger
      //     let userProfileObj;
      //     userProfileObj = {
      //       userName: this.data[i].username,
      //       email: this.data[i].email,
      //       };
      //     userProfileArray.push(userProfileObj);
      //   this.userData = userProfileArray;
      // }
      },
      error: (error) =>{
        this.service.setShowLoader.next(false);
      }
    })

    let header = new HttpHeaders().set("Authorization", this.userToken );
    return this.http.get(url, {headers:header});
  }
  headerExpand(){
    this.isHeaderExpand=!this.isHeaderExpand;
    this.isExpend.emit(this.isHeaderExpand)
  }
  logout() {
    if(localStorage.getItem('access_token') !=null){
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    this.toastr.success('success', 'You have successfully logged out!');
    this.router.navigate(['/']);
    this.loggedIn.next(false);
  }
  }
}

