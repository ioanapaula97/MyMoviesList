package com.bdsa.disertatie.backend.api;

import ai.onnxruntime.OrtException;
import com.bdsa.disertatie.backend.dto.FilmDto;
import com.bdsa.disertatie.backend.dto.FilmWikiData;
import com.bdsa.disertatie.backend.dto.RaspunsModelQA;
import com.bdsa.disertatie.backend.enums.StatusFilmEnum;
import com.bdsa.disertatie.backend.enums.TipSortareEnum;
import com.bdsa.disertatie.backend.service.FilmService;
import com.bdsa.disertatie.backend.service.FilmWikidataService;
import com.bdsa.disertatie.backend.service.ModelQuestionAnsweringService;
import com.bdsa.disertatie.backend.service.ModelRecomandariService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping(value = "api/v1/film")
@Validated
public class FilmRestController {
    private static final Logger LOG = LoggerFactory.getLogger(FilmRestController.class);
    private final FilmService filmService;
    private final FilmWikidataService filmWikidataService;
    private final ModelQuestionAnsweringService modelQuestionAnsweringService;
    private final ModelRecomandariService modelRecomandariService;

    @Autowired
    public FilmRestController(FilmService filmService, FilmWikidataService filmWikidataService, ModelQuestionAnsweringService modelQuestionAnsweringService, ModelRecomandariService modelRecomandariService) {
        this.filmService = filmService;
        this.filmWikidataService = filmWikidataService;
        this.modelQuestionAnsweringService = modelQuestionAnsweringService;
        this.modelRecomandariService = modelRecomandariService;
    }

    @GetMapping(value = "/toate-ale-utilizatorului/{userId}")
    public ResponseEntity<List<FilmDto>> toateFilmeleUtilizatorului(@PathVariable Long userId) {
        LOG.info("GET Toate filmele pentru  cu id-ul {}", userId);
        return ResponseEntity.ok().body(filmService.toateFilmeleUtilizatorului(userId));
    }

    @GetMapping(value = "/wikidata")
    public ResponseEntity<List<FilmWikiData>> getFilmeWikiDataDupaCoduri (@RequestParam(name = "coduriWikiData", required = false) List<String> coduriWikiData) throws JsonProcessingException {
        LOG.info("GET Toate filmele de la WIKIDATA <<Dupa Coduri>>, coduri= {} ", coduriWikiData);
        return ResponseEntity.ok().body(filmWikidataService.getFilmeDupaListaCoduri(coduriWikiData));
    }

    @GetMapping(value = "/wikidata/top-scor")
    public ResponseEntity<List<FilmWikiData>> getFilmeWikiDataTopScor () throws JsonProcessingException {
        LOG.info("GET Toate filmele de la WIKIDATA <<Top Scor>> ");
        return ResponseEntity.ok().body(filmWikidataService.getFilmeTopScor());
    }

    @GetMapping(value = "/wikidata/cele-mai-noi")
    public ResponseEntity<List<FilmWikiData>> getFilmeWikiDataCeleMaiNoi () throws JsonProcessingException {
        LOG.info("GET Toate filmele de la WIKIDATA <<Cele Mai Noi>> ");
        return ResponseEntity.ok().body(filmWikidataService.getFilmeCeleMaiNoi());
    }

    @GetMapping(value = "/wikidata/filtre")
    public ResponseEntity<List<FilmWikiData>> getFilmeWikiDataFiltre (@RequestParam(name = "GENRES", required = false) List<String> genuri,
                                                                      @RequestParam(name = "YEAR", required = false) Integer an,
                                                                      @RequestParam(name = "SCORE", required = false) Integer scor,
                                                                      @RequestParam(name = "SORT", required = false, defaultValue = "SCOR_DESC") TipSortareEnum tipSortare,
                                                                      @RequestParam(name = "GEN", required = false) String gen,
                                                                      @RequestParam(name = "ACTOR", required = false) String actor) throws JsonProcessingException {
        LOG.info("GET Toate filmele de la WIKIDATA dupa filtre, genuri= {}, an= {}, scor={}, tipSortare= {}, gen= {}, actor= {}",
                genuri, an, scor, tipSortare, gen, actor);
        List<FilmWikiData> filmeWikiData;

        if(actor != null){
            filmeWikiData = filmWikidataService.getFilmeDupaActor(actor, tipSortare);
        } else if (gen != null){
            filmeWikiData = filmWikidataService.getFilmeDupaGen(gen, tipSortare);
        } else{
            filmeWikiData = filmWikidataService.getFilmeDupaFiltreCombinate(genuri, an, scor, tipSortare);
        }

        return ResponseEntity.ok().body(filmeWikiData);
    }


    @PostMapping(value = "/adauga-favorit/{userId}/{codFilmWikiData}")
    public ResponseEntity<String> adaugaFilmLaFavorite(@PathVariable Long userId, @PathVariable String codFilmWikiData) {
        LOG.info("POST Adauga film la favorite userId= {}, codFilmWikiData= {}", userId, codFilmWikiData);

        filmService.modificaFilmFavorit(userId, codFilmWikiData, true);

        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/elimina-favorit/{userId}/{codFilmWikiData}")
    public ResponseEntity<String> eliminaFilmDeLaFavorite(@PathVariable Long userId, @PathVariable String codFilmWikiData) {
        LOG.info("POST Elimina film de la favorite userId= {}, codFilmWikiData= {}", userId, codFilmWikiData);

        filmService.modificaFilmFavorit(userId, codFilmWikiData, false);

        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/acorda-nota")
    public ResponseEntity<String> acordaNotaFilm(@RequestParam Long userId,
                                                 @RequestParam String codFilmWikiData,
                                                 @RequestParam(required = false) BigDecimal nota) {
        LOG.info("POST Acorda nota film userId= {}, codFilmWikiData= {}, nota={}", userId, codFilmWikiData, nota);

        filmService.acordaNotaFilm(userId, codFilmWikiData, nota);

        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/schimba-status")
    public ResponseEntity<String> schimbaStatusFilm(@RequestParam Long userId,
                                                    @RequestParam String codFilmWikiData,
                                                    @RequestParam(required = false) StatusFilmEnum statusFilm) {
        LOG.info("POST Schimba status film userId= {}, codFilmWikiData= {}, status= {}", userId, codFilmWikiData, statusFilm);

        filmService.modificaStatusFilm(userId, codFilmWikiData, statusFilm);

        return ResponseEntity.ok().build();
    }

    @GetMapping(value = "/model-qa-raspuns-intrebare")
    public ResponseEntity<RaspunsModelQA> getRaspunsDinModelMachineLearningQA (@RequestParam(name = "QUESTION", required = false) String intrebare) throws OrtException {
        LOG.info("GET raspuns intrebare din Model Machine Learning QA , intrebare= {}", intrebare);

        RaspunsModelQA raspunsModelQA = modelQuestionAnsweringService.getRaspunsIntrebare(intrebare);

//        raspunsModelQA.setRaspuns("raspuns " + LocalDateTime.now());
        return ResponseEntity.ok().body(raspunsModelQA);
    }

    @GetMapping(value = "/model-recomandari-filme")
    public ResponseEntity<List<FilmWikiData>> getFilmeDinModelMachineLearningRecomandari (@RequestParam(name = "user_id", required = false) Long userId) throws OrtException, JsonProcessingException {
        LOG.info("GET filme din Model Machine Learning Recomandari");

        List<FilmWikiData> filmeRecomandate = modelRecomandariService.getRecomandariFilme(userId);

        return ResponseEntity.ok().body(filmeRecomandate);
    }
}
