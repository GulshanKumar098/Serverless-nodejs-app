import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-template',
  templateUrl: './admin-template.component.html',
  styleUrls: ['./admin-template.component.css']
})
export class AdminTemplateComponent {
  @Input() isExpanded: boolean = true;

  headerEvent(event: boolean) {
    this.isExpanded = event;
  }

}
