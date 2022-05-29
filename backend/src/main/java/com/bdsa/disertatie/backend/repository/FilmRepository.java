package com.bdsa.disertatie.backend.repository;

import com.bdsa.disertatie.backend.entity.Film;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FilmRepository extends JpaRepository<Film, Long> {
}
