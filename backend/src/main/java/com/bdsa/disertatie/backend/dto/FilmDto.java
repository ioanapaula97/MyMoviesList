package com.bdsa.disertatie.backend.dto;

import com.bdsa.disertatie.backend.enums.StatusFilmEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FilmDto {
    private UserDto user;
    private Long id;
    private LocalDateTime created;
    private LocalDateTime version;
    private String codWikiData;
    private Boolean esteFavorit;
    private StatusFilmEnum statusFilm;
    private Integer notaFilm;
    private FilmWIkiData detaliiFilm;
}
