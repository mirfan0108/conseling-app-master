import { TestBed, async, inject } from '@angular/core/testing';

import { JustStartGuard } from './just-start.guard';

describe('JustStartGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JustStartGuard]
    });
  });

  it('should ...', inject([JustStartGuard], (guard: JustStartGuard) => {
    expect(guard).toBeTruthy();
  }));
});
