import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { stringify } from '@angular/core/src/util';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private inGame: boolean = false;
  private gameId$: Observable<string>;
  private gameId: string = "";
  private board$: Observable<string[]>;
  private board: string[] = ["", "", "", "", "", "", "", "", ""];

  constructor(private auth: AuthService, private db: AngularFireDatabase) {
    let uid = this.auth.getUserId();

    this.gameId$ = new Observable(o => {
      this.db.database.ref(`users/${uid}/game`).on('value', s => {
        o.next(s.val());
        this.gameId = s.val();
      }, e => {
        o.next("none");
        this.gameId = "none";
      });
    });

    this.board$ = new Observable(o => {
      this.gameId$.subscribe(id => {
        this.db.database.ref(`games/${id}/board`).on('value', s => {
          o.next(s.val());
          this.board = s.val();
        }, e => {
          o.next(["", "", "", "", "", "", "", "", ""]);
          this.board = ["", "", "", "", "", "", "", "", ""];
        });
      });
    });
  }

  newGame(): void {
    const uid = this.auth.getUserId()

    this.db.database.ref(`users/${uid}/game/board`).once('value').then(s => {
      if (!s.exists()) {
        let id = require('shortid').generate();

        this.db.object(`games/${id}/board`).update({
          0: "", 1: "", 2: "",
          3: "", 4: "", 5: "",
          6: "", 7: "", 8: ""
        });

        this.db.object(`users/${uid}`).update({
          game: id
        });
      }
    });
  }

  deleteGame(): void {
    this.db.object(`games/${this.gameId}`).remove();

    const uid = this.auth.getUserId();
    this.db.object(`users/${uid}/game`).remove();
  }

  getGame(): Observable<string> {
    return this.gameId$;
  }

  getBoard(): Observable<string[]> {
    return this.board$;
  }

  play(pos: number, piece: string): void {
    let newBoard = this.board;
    newBoard[pos] = piece;
    this.db.object(`games/${this.gameId}/board`).set(newBoard);
  }

  joinGame(id: string) {
    const uid = this.auth.getUserId();
    this.db.object(`users/${uid}`).update({
      game: id
    });

    this.db.object(`games/${id}/turn`).set(uid);
  }
}
