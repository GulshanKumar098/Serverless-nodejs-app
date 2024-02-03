import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent {
  @Input() isExpanded: boolean = true;

  headerEvent(event:boolean){
    this.isExpanded = event;
  }
}
