import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component'; 
import { TeacherTemplateComponent } from './teacher-template/teacher-template.component';
import { AvailableTestsComponent } from './available-tests/available-tests.component';
import { RetakeTestComponent } from './retake-test/retake-test.component';
import { QuestionsOverviewComponent } from './questions-overview/questions-overview.component';


const teacherRoutes: Routes = [
  {
    path: '', component: TeacherTemplateComponent,
    children: [
                  {path: '' , component: DashboardComponent},
                  {path: 'availableTests' , component: AvailableTestsComponent}, 
                  {path: 'retakeTests' , component: RetakeTestComponent}, 
                  {path: 'questionsOverview', component: QuestionsOverviewComponent}
              ]              
 }
];
@NgModule({
  imports: [RouterModule.forChild(teacherRoutes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { 
  constructor(){  
  }
}
