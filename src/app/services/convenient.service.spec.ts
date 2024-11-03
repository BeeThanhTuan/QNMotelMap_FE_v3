import { TestBed } from '@angular/core/testing';

import { ConvenientService } from './convenient.service';

describe('ConvenientService', () => {
  let service: ConvenientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConvenientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
