import { Component, OnInit } from '@angular/core';
import {FilmService} from "../../../service/film.service";

@Component({
  selector: 'app-video-details',
  templateUrl: './video-details.component.html',
  styleUrls: ['./video-details.component.less']
})
export class VideoDetailsComponent implements OnInit {

  filmSelectat: any;
  filmStatusEnum: any[] = [
    {view: 'COMPLETED', value: 'COMPLETED'},
    {view: 'PLAN TO WATCH', value: 'PLAN_TO_WATCH'},
    {view: 'WATCHING', value: 'WATCHING'}
  ];

  constructor(private filmService: FilmService) { }

  ngOnInit(): void {
    let filmStr: string = localStorage.getItem('filmSelectat') || '';
    this.filmSelectat = JSON.parse(filmStr) as Object;

    console.log('film selectat', this.filmSelectat);
  }

  getTooltip(): string {
    return this.filmSelectat.esteFavorit ? 'Elimina de la favorite' : 'Adauga la favorite';
  }

}
