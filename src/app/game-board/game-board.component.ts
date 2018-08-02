import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {

  private board = ["", "", "", "", "", "", "", "", ""];

  constructor(private games: GameService, private change: ChangeDetectorRef) { }

  ngOnInit() {
    this.refreshBoard();
  }

  play(pos: number) {
    this.games.play(pos, "X").subscribe(o => {
      this.board = o;
      this.change.detectChanges();
    });
  }

  refreshBoard() {
    this.games.getBoard().subscribe(o => {
      this.board = o;
    });
  }
}
