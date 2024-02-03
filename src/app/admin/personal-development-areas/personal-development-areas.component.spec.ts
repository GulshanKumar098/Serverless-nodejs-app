import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDevelopmentAreasComponent } from './personal-development-areas.component';

describe('PersonalDevelopmentAreasComponent', () => {
  let component: PersonalDevelopmentAreasComponent;
  let fixture: ComponentFixture<PersonalDevelopmentAreasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalDevelopmentAreasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalDevelopmentAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
