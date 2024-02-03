import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  formGroup: FormGroup;
  showResult = false;
  showPassword = false;

  @Input() thirPartyLogin = true

  constructor(private formBuilder: FormBuilder,private authService: AuthService, private router: Router) { }
  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      old_password: ['', [
        Validators.required
      ]],
      new_password: ['', [
        Validators.required
      ]]
    });
  }

  onShowPasswordClick() {
    this.showPassword = !this.showPassword
  }

  onReset() {
    this.formGroup.reset();
  }

}

