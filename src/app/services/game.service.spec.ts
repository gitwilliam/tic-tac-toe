import { TestBed, inject } from '@angular/core/testing';

import { GameService } from './game.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

class AuthServiceMock {
  getUserId(): string {
    return "TEST_USER";
  }
}

describe('GameService', () => {
  beforeEach(() => {
    const spy = jasmine.createSpyObj('AngularFireDatabase', ['database.ref', 'object.update']);

    TestBed.configureTestingModule({
      providers: [
        GameService,
        { provide: AngularFireAuth, use: AuthServiceMock },
        { provide: AngularFireDatabase, use: spy }
      ]
    });
  });

  it('should be created', inject([GameService], (service: GameService) => {
    expect(service).toBeTruthy();
  }));
});
