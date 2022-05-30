package com.bdsa.disertatie.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FilmWIkiData {
    String titlu;
    String descriere;
    String anAparitie;
    String urlImagine;
    String durata;
    Integer scorReview;
    List<String> genuri;

}
