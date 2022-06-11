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
public class FilmWikiData {
    String codWikiData;
    String titlu;
    String descriere;
    String anAparitie;
    String urlImagine;
    String durata;
    String scorReview;
    String regizor;
    List<String> actori;
    List<String> genuri;

}
