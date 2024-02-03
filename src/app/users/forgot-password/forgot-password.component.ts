import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string;
  constructor(private authService: AuthService, private toastr: ToastrService) { }

  // onSubmit() {
  //   this.authService.forgotPassword(this.email).subscribe({next:response =>  
  //     error:error => console.error('Error sending password reset email: ', error)
  // });
  // this.toastr.success('success', 'We have sent a link to your email to reset your password.');
  // }
  onSubmit(){
    this.authService.forgotPassword(this.email).subscribe(response => {
        this.toastr.success('Please Check Your Email Address', 'We have sent a link to your email to reset your password.');
        },
        error => {
          this.toastr.error('Invalid Email', 'We are unable to find the email address that you entered');
        }
      );
  // })
}
}
