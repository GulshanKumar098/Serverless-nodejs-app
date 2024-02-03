import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MaterialTableComponent } from './material-table/material-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatDialogComponent } from './mat-dialog/mat-dialog.component';
import {MatSortModule} from '@angular/material/sort';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ProfileComponent } from './profile/profile.component';
import { AdminRoutingModule } from '../admin/admin-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, SideMenuComponent, MaterialTableComponent, MatDialogComponent, ProfileComponent, ChangePasswordComponent],
  imports: [RouterModule, AdminRoutingModule, CommonModule, MatMenuModule, MatSidenavModule, MatToolbarModule, MatSnackBarModule, MatDialogModule, MatInputModule,MatButtonModule,FormsModule, MatSidenavModule,MatPaginatorModule,
    MatIconModule, MatListModule, MatTableModule,MatSortModule,BsDropdownModule.forRoot(), ModalModule.forRoot(),ReactiveFormsModule ],
  exports: [HeaderComponent, FooterComponent, SideMenuComponent, MaterialTableComponent],
  bootstrap: []
})
 
export class NavCommonModule { }
