import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private auth: AuthService, private db: AngularFireDatabase) { }

  newGame(): void {
    const uid = this.auth.getUserId()
    let gameId = "";

    this.db.database.ref(`users/${uid}/game`).once('value').then(s => {
      if (!s.exists()) {
        gameId = require('shortid').generate();

        // writing to database
        this.db.object(`games/${gameId}`).update({
          0: "", 1: "", 2: "",
          3: "", 4: "", 5: "",
          6: "", 7: "", 8: ""
        });

        this.db.object(`users/${uid}`).update({
          game: gameId
        });
      }
    });
  }

  getGame(user: string): Observable<string> {
    return new Observable<string>(obs => {
      this.db.database.ref(`users/${user}/game`).once('value').then(s => {
        if (!s.exists()) {
          obs.next("");
        } else {
          obs.next(s.val());
        }
      });
    });
  }
}
