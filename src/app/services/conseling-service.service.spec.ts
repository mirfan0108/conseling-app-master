import { TestBed } from '@angular/core/testing';

import { ConselingServiceService } from './conseling-service.service';

describe('ConselingServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConselingServiceService = TestBed.get(ConselingServiceService);
    expect(service).toBeTruthy();
  });
});
