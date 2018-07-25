import { TestBed, async, inject } from '@angular/core/testing';

import { IsAuthenticatedGuard } from './is-authenticated.guard';
import { AngularFireAuth } from 'angularfire2/auth';
import { RouterTestingModule } from '@angular/router/testing';

describe('IsAuthenticatedGuard', () => {
  beforeEach(() => {
    const spy = jasmine.createSpyObj('AngularFireAuth', ['auth.onAuthStateChanged']);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [
        IsAuthenticatedGuard,
        { provide: AngularFireAuth, useValue: spy }
      ]
    });
  });

  it('should ...', inject([IsAuthenticatedGuard], (guard: IsAuthenticatedGuard) => {
    expect(guard).toBeTruthy();
  }));
});
