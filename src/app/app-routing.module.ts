import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './users/login/login.component'; 
import { ForgotPasswordComponent } from './users/forgot-password/forgot-password.component';
import { AuthGuard } from './gaurds/auth.guard'; 
import { UpdatePasswordComponent } from './users/update-password/update-password.component';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';

const routes: Routes = [
  { path: '',  component: LoginComponent },
  { path: 'login' , component: LoginComponent}, 
  { path: 'forgotPassword' , component: ForgotPasswordComponent},
  { path: 'updatePassword/:token', component: UpdatePasswordComponent},
  { path: 'teacher', loadChildren: () => import('../app/teacher/teacher.module').then(m => m.TeacherModule),canActivate: [AuthGuard], data: { roles: ['teacher'] } },
  { path: 'admin', loadChildren: () => import('../app/admin/admin.module').then(m => m.AdminModule) ,canActivate: [AuthGuard], data: { roles: ['admin'] }}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }]
})
export class AppRoutingModule { 

}
