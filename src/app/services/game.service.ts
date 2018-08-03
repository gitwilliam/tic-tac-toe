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

        this.db.object(`games/${gameId}/board`).update({
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

  getGame(): Promise<string> {
    const uid = this.auth.getUserId();
    return new Promise<string>((res, rej) => {
      this.db.database.ref(`users/${uid}/game`).once('value').then(s => {
        if (s.exists()) {
          res(s.val());
        } else {
          rej("Game Not Found");
        }
      });
    });
  }

  getBoard(): Promise<string[]> {
    const uid = this.auth.getUserId();
    return new Promise<string[]>((res, rej) => {
      this.getGame().then(o => {
        this.db.database.ref(`games/${o}/board`).once('value').then(s => {
          if (s.exists()) {
            res(s.val());
          } else {
            rej(Error('Board Not Found'))
          }
        });
      });
    });
  }

  playPiece(pos: number, piece: string): Promise<string[]> {
    return new Promise<string[]>((res, rej) => {
      this.getBoard().then(o1 => {
        this.getGame().then(o2 => {
          let newBoard = o1;
          newBoard[pos] = piece;
          this.db.object(`games/${o2}/board`).set(newBoard);
          res(newBoard);
        });
      });
    });
  }

  joinGame(id: string) {
    const uid = this.auth.getUserId();
    this.db.object(`users/${uid}`).update({
      game: id
    });

    this.db.object(`games/${id}/turn`).set(uid);
  }
}
