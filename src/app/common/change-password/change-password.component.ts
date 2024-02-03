import { HttpHeaders } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  formGroup: FormGroup;
  showResult = false;
  showPassword = false;
  data: any = null;
  old_password: string;
  new_password: string;
  
  constructor(private authService: AuthService,private toastr: ToastrService, private formBuilder: FormBuilder, private adminService : AdminService) { }
  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]]
    });
  }
  changePassword(){
    const access_token = localStorage.getItem('access_token');
    this.old_password = this.formGroup.value.oldPassword;
    this.new_password = this.formGroup.value.newPassword; 
    // this.adminService.put(url,this.changePasswordForm.value).subscribe(response=>{ 
    this.authService.changePassword(this.old_password, this.new_password, this.authService.getToken()).subscribe(response => {
        this.toastr.success('success', 'Updated Successfully!');
        },
        error => {
          // Handle error
        }
      );
  // })
}
  onShowPasswordClick() {
    this.showPassword = !this.showPassword
  }

  onReset() {
    this.formGroup.reset();
  }
}
