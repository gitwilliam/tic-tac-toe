import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GameService } from '../services/game.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private gameId$: Observable<string>;
  private gameId: string;

  constructor(private games: GameService, private change: ChangeDetectorRef) {
    this.gameId$ = this.games.getGame();
    this.gameId$.subscribe(o => {
      this.gameId = o;
      this.change.detectChanges();
    });
  }

  ngOnInit() {
  }

  newGame(): void {
    this.games.newGame();
  }

  endGame(): void {
    this.games.deleteGame();
  }

  joinGame(id: string) {
    this.games.joinGame(id);
  }
}
