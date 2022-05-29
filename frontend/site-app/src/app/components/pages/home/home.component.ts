import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  moviesList = [
    {title: 'Nasul', year: 1972, picture: 'https://mcdn.elefant.ro/mnresize/1500/1500/images/57/1356657/nasul-vol-1_1_fullsize.jpg'},
    {title: 'Cavalerul negru', year: 2008, picture: 'https://upload.wikimedia.org/wikipedia/ro/d/d1/The_Dark_Knight.jpg'},
    {title: 'Lista lui Schindler', year: 1993, picture: 'https://mcdn.elefant.ro/mnresize/1500/1500/images/58/2005758/lista-lui-schindler_1_fullsize.jpg'},
    {title: 'Forest Gump', year: 1994, picture: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg'}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
