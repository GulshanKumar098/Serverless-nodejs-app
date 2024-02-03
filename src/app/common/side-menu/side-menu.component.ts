import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router'
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {
  @Input() isExpanded:boolean=true;
  currentRole:string;
  constructor(private router: Router, private authService: AuthService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.isExpanded =changes?.['isExpanded']?.currentValue;
  }
  ngOnInit() {
    this.currentRole = this.authService.getRole();
  }
  hasRoute(route: string) {
    return this.router.url.includes(route);
  }

}
