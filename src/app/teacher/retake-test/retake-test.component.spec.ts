import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetakeTestComponent } from './retake-test.component';

describe('RetakeTestComponent', () => {
  let component: RetakeTestComponent;
  let fixture: ComponentFixture<RetakeTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetakeTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetakeTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
