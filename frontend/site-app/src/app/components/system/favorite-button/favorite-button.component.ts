import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Utils} from "../../../utils/Utils";
import {FilmService} from "../../../service/film.service";
import {UserService} from "../../../service/user.service";

@Component({
  selector: 'app-favorite-button',
  templateUrl: './favorite-button.component.html',
  styleUrls: ['./favorite-button.component.less']
})
export class FavoriteButtonComponent implements OnInit {
  @Input() filmCurent: any | undefined;
  @Input() coduriFilmeFavorite: string[] | undefined;
  @Input() statusFavorit: any | undefined;
  @Output() statusFavoritChange = new EventEmitter<any | undefined>();

  constructor(private filmService: FilmService, private userService: UserService) {}
  ngOnInit(): void {}

  getTooltip(film: any): string {return Utils.getTooltipButonFavorite(film.codWikiData, this.coduriFilmeFavorite);}

  schimbaFavorite(film: any) {
    if (this.filmulEsteFavorit(film)) {
      this.filmService.eliminaFilmDeLaFavorite(this.userService.getIdUtilizatorCurent(), film.codWikiData)
        .subscribe(res => this.statusFavoritChange.emit({esteFavorit: false}));
    } else {
      this.filmService.adaugaFilmLaFavorite(this.userService.getIdUtilizatorCurent(), film.codWikiData)
        .subscribe(res => this.statusFavoritChange.emit({esteFavorit: true}));
    }
  }

  filmulEsteFavorit(film: any) {return Utils.filmulEsteFavorit(film.codWikiData, this.coduriFilmeFavorite);}
}
