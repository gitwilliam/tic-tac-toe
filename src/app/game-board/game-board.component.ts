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
    this.games.playPiece(pos, "X").then(o => {
      this.board = o;
      this.change.detectChanges();
    })
    .catch(e => console.log(e));
  }

  refreshBoard() {
    this.games.getBoard().then(o => {
      this.board = o;
    })
    .catch(e => console.log(e));
  }
}
