import { TestBed } from '@angular/core/testing';

import { EmailtemplatesService } from './emailtemplates.service';

describe('EmailtemplatesService', () => {
  let service: EmailtemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailtemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
