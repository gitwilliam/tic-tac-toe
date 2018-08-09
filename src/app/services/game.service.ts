import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { stringify } from '@angular/core/src/util';
import { EMPTY_ARRAY } from '@angular/core/src/view';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private EMPTY_BOARD = ["", "", "", "", "", "", "", "", ""]; 
  private piece: string = "";
  private inGame: boolean = false;
  private gameId$: Observable<string>;
  private gameId: string = "";
  private board$: Observable<string[]>;
  private board: string[] = this.EMPTY_BOARD;

  constructor(private auth: AuthService, private db: AngularFireDatabase) {
    let uid = this.auth.getUserId();

    this.gameId$ = new Observable(o => {
      this.db.database.ref(`users/${uid}/game`).on('value', s => {
        if (s.exists()) {
          o.next(s.val());
          this.gameId = s.val();
        } else {
          o.next("none");
          this.gameId = "none";
        }
      }, e => {
        o.next("none");
        this.gameId = "none";
      });
    });

    this.board$ = new Observable(o => {
      this.gameId$.subscribe(id => {
        this.db.database.ref(`games/${id}/board`).on('value', s => {
          if (s.exists()) {
            o.next(s.val());
            this.board = s.val();
          } else {
            o.next(this.EMPTY_BOARD);
            this.board = this.EMPTY_BOARD;
          }
        }, e => {
          o.next(this.EMPTY_BOARD);
          this.board = this.EMPTY_BOARD;
        });
      });
    });

    // get piece
    this.gameId$.subscribe(id => {
      this.db.database.ref(`games/${id}/${uid}`).on('value', s => {
        this.piece = s.val();
      }, e => {
        this.piece = "";
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

        // the creator of the game should be "O's"
        this.db.object(`games/${id}/${uid}`).set("O");
        this.db.object(`games/${id}/user1`).set(uid);
      }
    });
  }

  deleteGame(): void {
    this.db.object(`games/${this.gameId}`).remove();
  }

  getGame(): Observable<string> {
    return this.gameId$;
  }

  getBoard(): Observable<string[]> {
    return this.board$;
  }

  play(pos: number): void {
    let newBoard = this.board;
    newBoard[pos] = this.piece;
    this.db.object(`games/${this.gameId}/board`).set(newBoard);
  }

  joinGame(id: string) {
    const uid = this.auth.getUserId();
    this.db.object(`users/${uid}`).update({
      game: id
    });

    // the guest of the game should be "X's"
    this.db.object(`games/${id}/${uid}`).set("X");
    this.db.object(`games/${id}/user2`).set(uid);
  }
}
