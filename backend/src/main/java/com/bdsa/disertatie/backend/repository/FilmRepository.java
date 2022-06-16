package com.bdsa.disertatie.backend.repository;

import com.bdsa.disertatie.backend.entity.Film;
import com.bdsa.disertatie.backend.entity.Utilizator;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FilmRepository extends JpaRepository<Film, Long> {

    List<Film> findAllByUtilizator(Utilizator utilizator);

    Film findByUtilizatorAndCodWikiData(Utilizator utilizator, String codWikiData);
}
