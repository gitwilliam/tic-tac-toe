import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private games: GameService, private change: ChangeDetectorRef) { }

  private gameId: string = "";

  ngOnInit() {
    this.loadGameID();
  }

  newGame(): void {
    this.games.newGame().then(id => {
      this.gameId = id;
      this.change.detectChanges();
    });
  }

  endGame(): void {
    this.games.endGame();
    this.loadGameID();
  }

  joinGame(id: string) {
    this.games.joinGame(id);
    this.loadGameID();
  }

  private loadGameID(): void {
    this.games
      .getGame()
      .then(o => {
        this.gameId = o;

        // For some reason this code is breaking outside of Angular change detection
        this.change.detectChanges();
      })
      .catch(e => {
        this.gameId = e;
        this.change.detectChanges();
        });
  }
}
