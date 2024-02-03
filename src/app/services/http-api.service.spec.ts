import { TestBed } from '@angular/core/testing';

import { HttpAPIService } from './http-api.service';

describe('HttpAPIService', () => {
  let service: HttpAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
