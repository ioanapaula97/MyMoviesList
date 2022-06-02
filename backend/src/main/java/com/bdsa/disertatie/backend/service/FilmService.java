package com.bdsa.disertatie.backend.service;

import com.bdsa.disertatie.backend.dto.FilmDto;
import com.bdsa.disertatie.backend.entity.Film;
import com.bdsa.disertatie.backend.entity.User;
import com.bdsa.disertatie.backend.enums.StatusFilmEnum;
import com.bdsa.disertatie.backend.repository.FilmRepository;
import com.bdsa.disertatie.backend.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FilmService {
    private static final Logger LOG = LoggerFactory.getLogger(FilmService.class);

    private final FilmRepository filmRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public FilmService(FilmRepository filmRepository, UserRepository userRepository, ModelMapper modelMapper) {
        this.filmRepository = filmRepository;
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
    }

    public List<FilmDto> toateFilmeleUtilizatorului(Long userId) {
        User user = userRepository.getById(userId);
        List<Film> lista = null;

        if (user != null) lista = filmRepository.findAllByUser(user);
        if (lista != null) return lista.stream().map(this::mapToDto).collect(Collectors.toList());

        return new ArrayList<>();
    }

    @Transactional
    public void modificaDetaliiFilm(Long userId, String codFilmWikiData, Boolean esteFavorit, Integer notaFilm, StatusFilmEnum statusFilm){
        User user = userRepository.getById(userId);
        Film film = null;

        if (user != null) film = filmRepository.findByUserAndCodWikiData(user, codFilmWikiData);
        if(film == null){
            film = new Film();
            film.setUser(user);
            film.setCodWikiData(codFilmWikiData);
        }

        if(esteFavorit != null) film.setEsteFavorit(esteFavorit);
        if(notaFilm != null) film.setNotaFilm(notaFilm);
        if(statusFilm != null) film.setStatusFilm(statusFilm);
        filmRepository.save(film);

    }


    private FilmDto mapToDto(Film entity) {
        return modelMapper.map(entity, FilmDto.class);
    }
}
