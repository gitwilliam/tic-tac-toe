import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { stringify } from '@angular/core/src/util';

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
        obs.complete();
      });
    });
  }

  getBoard(): Observable<string[]> {
    const uid = this.auth.getUserId();
    return new Observable<string[]>(obs => {
      this.getGame(uid).subscribe(o => {
        this.db.database.ref(`games/${o}`).once('value').then(s => {
          if (s.exists()) {
            obs.next(s.val());
          }
          obs.complete();
        });
      });
    });
  }

  play(pos: number, piece: string): Observable<string[]> {
    const uid = this.auth.getUserId();
    return new Observable<string[]>(obs => {
      this.getBoard().subscribe(o1 => {
        this.getGame(uid).subscribe(o2 => {
          let newBoard = o1;
          newBoard[pos] = piece;
          this.db.object(`games/${o2}`).set(newBoard);
          obs.next(newBoard);
          obs.complete();
        });
      });
    });
  }
}
