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
    const gameId = require('shortid').generate();

    // writing to database
    this.db.object(`games/${gameId}`).update({ id: gameId, user1: uid, user2: "" });
    return gameId;
  }
}
