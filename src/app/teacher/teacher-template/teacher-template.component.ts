import { Component, Input } from '@angular/core';
import { HttpAPIService } from 'src/app/services/http-api.service';

@Component({
  selector: 'app-teacher-template',
  templateUrl: './teacher-template.component.html',
  styleUrls: ['./teacher-template.component.css']
})
export class TeacherTemplateComponent {
  showLoader: boolean = true;

  constructor(
    private service:HttpAPIService,
    ) {
    this.service.setShowLoader.subscribe(el=>{
      this.showLoader = el;
    })
  }
  @Input() isExpanded: boolean = true;
  // @Input() loading: boolean = false;

  headerEvent(event:boolean){
    this.isExpanded = event;
  }


}
