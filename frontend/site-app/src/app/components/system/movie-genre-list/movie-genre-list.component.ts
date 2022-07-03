import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-movie-genre-list',
  templateUrl: './movie-genre-list.component.html',
  styleUrls: ['./movie-genre-list.component.less']
})
export class MovieGenreListComponent implements OnInit {

  @Input() film: any | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
