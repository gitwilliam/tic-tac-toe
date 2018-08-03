import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router, private games: GameService, private change: ChangeDetectorRef) { }

  private gameId: string = "";

  ngOnInit() {
    this.loadGameID();
  }

  signOut(): void {
    this.auth.signOut();
    this.router.navigate(["login"]);
  }

  newGame(): void {
    this.games.newGame();
    this.loadGameID();
  }

  private loadGameID(): void {
    this.games.getGame().then(o => {
      this.gameId = o;

      // For some reason this code is breaking outside of Angular change detection
      this.change.detectChanges();
    })
    .catch(e => console.log(e));
  }
}
