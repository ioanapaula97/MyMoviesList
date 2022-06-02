package com.bdsa.disertatie.backend.repository;

import com.bdsa.disertatie.backend.entity.Film;
import com.bdsa.disertatie.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FilmRepository extends JpaRepository<Film, Long> {

    List<Film> findAllByUser(User user);

    Film findByUserAndCodWikiData(User user, String codWikiData);
}
