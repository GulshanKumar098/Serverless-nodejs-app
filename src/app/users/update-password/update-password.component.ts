import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit{
  formGroup: FormGroup;
  showResult = false;
  showPassword = false;
  resetToken: string;
  new_password: string;
  
  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService,private toastr: ToastrService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.resetToken = this.route.snapshot.params['token'];
    this.formGroup = this.formBuilder.group({
      newPassword: ['', [Validators.required]]
    });
  }
  changePassword(){
    this.new_password = this.formGroup.value.newPassword; 
    // this.adminService.put(url,this.changePasswordForm.value).subscribe(response=>{ 
    this.authService.resetPassword(this.resetToken, this.new_password).subscribe({next:response => {
      this.router.navigate(['/']);
      this.toastr.success('success', 'Your New Password Updated Successfully!');
        },
        error:error => {
          // Handle error
        }}
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
