import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiHandlerService } from './api-handler.service';
import { MatDialogConfig } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor() {}

  openModel(data:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;
    dialogConfig.width = '50%';
    dialogConfig.position= {top: '-30%', left:'30%',bottom:'0%'};
    dialogConfig.data = {
      width: '500px',
      height: '500px',
    };
    dialogConfig.data={...data};
    return dialogConfig;
  }



}
