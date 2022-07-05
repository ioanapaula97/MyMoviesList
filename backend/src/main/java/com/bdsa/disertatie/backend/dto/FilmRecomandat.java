package com.bdsa.disertatie.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FilmRecomandat {
    private String codWikiData;
    private Float scorModel;

}
