import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './users/login/login.component';
import { RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './users/forgot-password/forgot-password.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import {MatMenuModule} from '@angular/material/menu';
import { MaterialTableComponent } from './common/material-table/material-table.component';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import {MatPaginatorModule} from '@angular/material/paginator';
import { ResetPasswordComponent } from './users/reset-password/reset-password.component';
import { ToastrModule } from 'ngx-toastr';
import { NavCommonModule } from './common/nav-common.module';
import { UpdatePasswordComponent } from './users/update-password/update-password.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material'; 
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer'; 
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent, ResetPasswordComponent, UpdatePasswordComponent
  ],
  imports: [BrowserAnimationsModule,
    MatMenuModule,MatTableModule, MatSelectModule, MatButtonModule,PdfViewerModule,
    BrowserModule,AppRoutingModule,RouterModule,FormsModule,ReactiveFormsModule,NgApexchartsModule , MatNativeDateModule, HttpClientModule, MatMenuModule, MatPaginatorModule,
    ToastrModule.forRoot(), NgxDaterangepickerMd.forRoot(), NavCommonModule, NgxLoadingModule.forRoot({})
  ],
  exports:[],
  providers: [MaterialTableComponent, {provide: LocationStrategy, useClass: PathLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
