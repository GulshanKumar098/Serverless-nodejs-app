import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TeacherTemplateComponent } from './teacher-template/teacher-template.component';
import { TeacherRoutingModule } from './teacher-routing.module';
import { NavCommonModule } from '../common/nav-common.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AvailableTestsComponent } from './available-tests/available-tests.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { RetakeTestComponent } from './retake-test/retake-test.component';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { QuestionsOverviewComponent } from './questions-overview/questions-overview.component';
import { PdfViewerModule } from 'ng2-pdf-viewer'; 
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  declarations: [DashboardComponent, TeacherTemplateComponent, AvailableTestsComponent, RetakeTestComponent, QuestionsOverviewComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatTableModule,PdfViewerModule,
    NgApexchartsModule, TeacherRoutingModule, NavCommonModule, MatSidenavModule, MatListModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatChipsModule, MatIconModule, MatCheckboxModule, NgxLoadingModule.forRoot({})],
  exports: []
})
export class TeacherModule { }
