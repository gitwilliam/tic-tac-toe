import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private auth: AuthService, private db: AngularFireDatabase) { }

  newGame(): string {
    const uid = this.auth.getUserId()

    this.db.database.ref(`users/${uid}/game`).once('value').then(snapshot => {
      if (!snapshot.exists()) {
        const gameId = require('shortid').generate();

        // writing to database
        this.db.object(`games/${gameId}`).update({
          0: "", 1: "", 2: "",
          3: "", 4: "", 5: "",
          6: "", 7: "", 8: ""
        });

        this.db.object(`users/${uid}`).update({
          game: gameId
        });

        console.log(snapshot.val());
        return gameId;
      } else {
        console.log(snapshot.val());
        return snapshot.val();
      }
    });

    return "";
  }
}
