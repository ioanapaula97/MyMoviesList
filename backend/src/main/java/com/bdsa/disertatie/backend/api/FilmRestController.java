package com.bdsa.disertatie.backend.api;

import ai.onnxruntime.OrtException;
import com.bdsa.disertatie.backend.dto.FilmDto;
import com.bdsa.disertatie.backend.dto.FilmWikiData;
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

//    @GetMapping(value = "/toate-paginate")
//    public ResponseEntity<Page<FilmDto>> toateFilmelePaginate(Pageable pageable,
//                                                              @RequestParam(value = "text", required = false, defaultValue = "")
//                                                              @Pattern(regexp = RegExpValidation.TEXT_CAUTARE)
//                                                              String textCautare){
//        LOG.info("Toate filmele paginate");
//        Page<FilmDto> pagina= new PageImpl<>(Collections.emptyList(), pageable, Collections.emptyList().size());
//
//        return ResponseEntity.ok().body(pagina);
//    }

    @GetMapping(value = "/wikidata/top-box-office")
    public ResponseEntity<List<FilmWikiData>> getFilmeWikiDataTopBoxOffice () throws JsonProcessingException {
        LOG.info("GET Toate filmele de la WIKIDATA <<Top Box Office>> ");

        List<FilmWikiData> filmeWikiData;

        filmeWikiData = filmWikidataService.getFilmeTopBoxOffice();

        return ResponseEntity.ok().body(filmeWikiData);
    }

    @GetMapping(value = "/wikidata/top-scor")
    public ResponseEntity<List<FilmWikiData>> getFilmeWikiDataTopScor () throws JsonProcessingException {
        LOG.info("GET Toate filmele de la WIKIDATA <<Top Scor>> ");
        List<FilmWikiData> filmeWikiData;

        filmeWikiData = filmWikidataService.getFilmeTopScor();

        return ResponseEntity.ok().body(filmeWikiData);
    }

    @GetMapping(value = "/wikidata/genuri")
    public ResponseEntity<List<FilmWikiData>> getFilmeWikiDataGenuri (@RequestParam(required = false) List<String> genuri,
                                                                      @RequestParam(required = false, defaultValue = "SCOR_DESC") TipSortareEnum tipSortare) throws JsonProcessingException {
        LOG.info("GET Toate filmele de la WIKIDATA dupa genuri= {}, tipSortare= {}", genuri, tipSortare);
        List<FilmWikiData> filmeWikiData;

        filmeWikiData = filmWikidataService.getFilmeDupaGen(genuri, tipSortare);

        return ResponseEntity.ok().body(filmeWikiData);
    }

    @GetMapping(value = "/wikidata/an-aparitie")
    public ResponseEntity<List<FilmWikiData>> getFilmeWikiDataAnAparitie (@RequestParam(required = false) Integer anAparitie,
                                                                          @RequestParam(required = false, defaultValue = "SCOR_DESC") TipSortareEnum tipSortare) throws JsonProcessingException {
        LOG.info("GET Toate filmele de la WIKIDATA dupa anAparitie= {}, tipSortare= {}", anAparitie, tipSortare);
        List<FilmWikiData> filmeWikiData;

        filmeWikiData = filmWikidataService.getFilmeDupaAnAparitie(anAparitie, tipSortare);

        return ResponseEntity.ok().body(filmeWikiData);
    }

    @GetMapping(value = "/wikidata/varsta")
    public ResponseEntity<List<FilmWikiData>> getFilmeDupaVarstaPermisa (@RequestParam(required = false) String varsta,
                                                                         @RequestParam(required = false, defaultValue = "SCOR_DESC") TipSortareEnum tipSortare) throws JsonProcessingException {
        LOG.info("GET Toate filmele de la WIKIDATA dupa varsta= {}, tipSortare= {}", varsta, tipSortare);
        List<FilmWikiData> filmeWikiData;

        filmeWikiData = filmWikidataService.getFilmeDupaVarstaPermisa(varsta, tipSortare);

        return ResponseEntity.ok().body(filmeWikiData);
    }



    @GetMapping(value = "/toate-ale-utilizatorului/{userId}")
    public ResponseEntity<List<FilmDto>> toateFilmeleUtilizatorului(@PathVariable Long userId) throws JsonProcessingException {
        LOG.info("GET Toate filmele pentru  cu id-ul {}", userId);
        List<FilmDto> filmeleUtilizatorului;

        filmeleUtilizatorului = filmService.toateFilmeleUtilizatorului(userId);

        return ResponseEntity.ok().body(filmeleUtilizatorului);
    }

    @PostMapping(value = "/adauga-favorit/{userId}/{codFilmWikiData}")
    public ResponseEntity<String> adaugaFilmLaFavorite(@PathVariable Long userId, @PathVariable String codFilmWikiData) throws JsonProcessingException {
        LOG.info("POST Adauga film la favorite userId= {}, codFilmWikiData= {}", userId, codFilmWikiData);

        filmService.modificaDetaliiFilm(userId, codFilmWikiData, true, null, null);

        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/elimina-favorit/{userId}/{codFilmWikiData}")
    public ResponseEntity<String> eliminaFilmDeLaFavorite(@PathVariable Long userId, @PathVariable String codFilmWikiData) throws JsonProcessingException {
        LOG.info("POST Elimina film de la favorite userId= {}, codFilmWikiData= {}", userId, codFilmWikiData);

        filmService.modificaDetaliiFilm(userId, codFilmWikiData, false, null, null);

        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/acorda-nota/{userId}/{codFilmWikiData}/{nota}")
    public ResponseEntity<String> acordaNotaFilm(@PathVariable Long userId,
                                                 @PathVariable String codFilmWikiData,
                                                 @PathVariable Integer nota) throws JsonProcessingException {
        LOG.info("POST Acorda nota film userId= {}, codFilmWikiData= {}, nota={}", userId, codFilmWikiData, nota);

        filmService.modificaDetaliiFilm(userId, codFilmWikiData, null, nota, null);

        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/schimba-status/{userId}/{codFilmWikiData}/{statusFilm}")
    public ResponseEntity<String> schimbaStatusFilm(@PathVariable Long userId,
                                                    @PathVariable String codFilmWikiData,
                                                    @PathVariable StatusFilmEnum statusFilm) throws JsonProcessingException {
        LOG.info("POST Schimba status film userId= {}, codFilmWikiData= {}, status= {}", userId, codFilmWikiData, statusFilm);

        filmService.modificaDetaliiFilm(userId, codFilmWikiData, null, null, statusFilm);

        return ResponseEntity.ok().build();
    }

    @GetMapping(value = "/model-qa-raspuns-intrebare")
    public ResponseEntity<String> getRaspunsDinModelMachineLearningQA (@RequestParam(required = false) String intrebare) throws OrtException {
        LOG.info("GET raspuns intrebare din Model Machine Learning QA , intrebare= {}", intrebare);


        return ResponseEntity.ok().body(modelQuestionAnsweringService.getRaspunsIntrebare(intrebare));
    }

    @GetMapping(value = "/model-recomandari-filme")
    public ResponseEntity<String> getFilmeDinModelMachineLearningRecomandari () throws OrtException {
        LOG.info("GET filme din Model Machine Learning Recomandari");
        modelRecomandariService.getRecomandariFilme();

        return ResponseEntity.ok().build();
    }
}
