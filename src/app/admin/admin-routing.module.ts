import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { PersonalDevelopmentAreasComponent } from './personal-development-areas/personal-development-areas.component';
import { quizComponent } from './quiz/quiz.component';
import { AdminTemplateComponent } from './admin-template/admin-template.component';
import { SchoolsListComponent } from './schools-list/schools-list.component';
import { TeachersListComponent } from './teachers-list/teachers-list.component';
import { ProfileComponent } from '../common/profile/profile.component';
import { ChangePasswordComponent } from '../common/change-password/change-password.component';

const adminRoutes: Routes = [
  {
    path: '', component: AdminTemplateComponent,
    children: [
                  { path: '' , component: AdminDashboardComponent },
                  { path: 'personaldevelopment', component: PersonalDevelopmentAreasComponent },
                  { path: 'quiz' , component: quizComponent },
                  { path:'schoolsList', component:SchoolsListComponent },
                  { path:'teachersList', component:TeachersListComponent },
                  { path:'profile', component:ProfileComponent },
                  { path:'changePassword', component:ChangePasswordComponent }
              ]              
 }
];
@NgModule({
  imports: [CommonModule, RouterModule.forChild(adminRoutes)],
exports: [RouterModule]
})
export class AdminRoutingModule { }
