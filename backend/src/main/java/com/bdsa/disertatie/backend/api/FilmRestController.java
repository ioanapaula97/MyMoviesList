package com.bdsa.disertatie.backend.api;

import com.bdsa.disertatie.backend.dto.FilmDto;
import com.bdsa.disertatie.backend.dto.RegExpValidation;
import com.bdsa.disertatie.backend.service.FilmService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import javax.validation.constraints.Pattern;

@RestController
@RequestMapping(value = "api/v1/film")
@Validated
public class FilmRestController {
    private static final Logger LOG = LoggerFactory.getLogger(FilmRestController.class);

    private final FilmService filmService;

    @Autowired
    public FilmRestController(FilmService filmService) {
        this.filmService = filmService;
    }

    @GetMapping(value = "/toate-paginate")
    public ResponseEntity<Page<FilmDto>> toateFilmelePaginate(Pageable pageable,
                                                              @RequestParam(value = "text", required = false, defaultValue = "")
                                                              @Pattern(regexp = RegExpValidation.TEXT_CAUTARE)
                                                              String textCautare){
        LOG.info("Toate filmele paginate");
        Page<FilmDto> pagina= new PageImpl<>(Collections.emptyList(), pageable, Collections.emptyList().size());

        return ResponseEntity.ok().body(pagina);
    }
}
