package com.bdsa.disertatie.backend.service;

import com.bdsa.disertatie.backend.dto.Actor;
import com.bdsa.disertatie.backend.dto.FilmWikiData;
import com.bdsa.disertatie.backend.dto.GenFilm;
import com.bdsa.disertatie.backend.enums.TipSortareEnum;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.eclipse.rdf4j.query.resultio.sparqljson.SPARQLResultsJSONWriter;
import org.eclipse.rdf4j.repository.sparql.SPARQLRepository;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FilmWikidataService {
    private static final Logger LOG = LoggerFactory.getLogger(FilmWikidataService.class);

    private final ObjectMapper objectMapper;

    @Autowired
    public FilmWikidataService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public List<FilmWikiData> getFilmeDupaListaCoduri(List<String> coduriWikiData)
            throws JsonProcessingException {
        List<FilmWikiData> lista = new ArrayList<>();
        if(coduriWikiData != null){
            String querySPARQL = getQueryStringDupaListaCoduri(coduriWikiData) + getConditieSortare(TipSortareEnum.SCOR_DESC) + LIMITA_FILME;
            String raspunsJsonString = executaQuerySPARQL(querySPARQL);
            lista = parseazeListaFilmeDeLaWikiData(raspunsJsonString);
        }

        return lista;
    }

    public List<FilmWikiData> getFilmeDupaFiltreCombinate(List<String> genuri, Integer an, Integer scor, TipSortareEnum tipSortare)
            throws JsonProcessingException {
        LOG.info("GET FILME DUPA FILTRE COMBINATE, genuri= {}, an= {}, scor= {}, tipSortare={}", genuri, an, scor, tipSortare);

        String querySPARQL = getQueryFiltreCombinate(genuri, an, scor, tipSortare) + LIMITA_FILME;
        String raspunsJsonString = executaQuerySPARQL(querySPARQL);
        List<FilmWikiData> lista = parseazeListaFilmeDeLaWikiData(raspunsJsonString);

        return lista;
    }

    public List<FilmWikiData> getFilmeDupaGen(String codGen, TipSortareEnum tipSortare)
            throws JsonProcessingException {
        LOG.info("GET FILME DUPA GEN, gen={}, tipSortare={}", codGen, tipSortare);
        List<FilmWikiData> lista = new ArrayList<>();
        if(codGen != null){
            String querySPARQL = getQueryStringDupaGenuri(new ArrayList<>(Arrays.asList(codGen))) + getConditieSortare(tipSortare) + LIMITA_FILME;
            String raspunsJsonString = executaQuerySPARQL(querySPARQL);
            lista = parseazeListaFilmeDeLaWikiData(raspunsJsonString);
        }

        return lista;
    }

    public List<FilmWikiData> getFilmeDupaActor(String codActor, TipSortareEnum tipSortare)
            throws JsonProcessingException {
        LOG.info("GET FILME DUPA ACTOR, actor={}, tipSortare={}", codActor, tipSortare);
        List<FilmWikiData> lista = new ArrayList<>();
        if(codActor != null){
            String querySPARQL = getQueryStringDupaActori(codActor) + getConditieSortare(tipSortare) + LIMITA_FILME;
            String raspunsJsonString = executaQuerySPARQL(querySPARQL);
            lista = parseazeListaFilmeDeLaWikiData(raspunsJsonString);
        }

        return lista;
    }

    public List<FilmWikiData> getFilmeTopScor () throws JsonProcessingException {
        String raspunsJsonString = executaQuerySPARQL(QUERY_FILME_TOP_SCOR);
        List<FilmWikiData> lista = parseazeListaFilmeDeLaWikiData(raspunsJsonString);

        return lista;
    }

    public List<FilmWikiData> getFilmeCeleMaiNoi () throws JsonProcessingException {
        String raspunsJsonString = executaQuerySPARQL(QUERY_FILME_CELE_MAI_NOI);
        List<FilmWikiData> lista = parseazeListaFilmeDeLaWikiData(raspunsJsonString);

        return lista;
    }

    private List<FilmWikiData> getFilmeSortat (TipSortareEnum tipSortareEnum){
        List<FilmWikiData> lista = new ArrayList<>();

        return lista;
    }

    private String getQueryFiltreCombinate (List<String> genuri, Integer an, Integer scor, TipSortareEnum tipSortare) {
        String queryRezultat = QUERY_FILME_FILTRE_COMBINATE;

        queryRezultat = queryRezultat.replace("<<<ORDONARE>>>", getConditieSortare(tipSortare));

        /* conditie genuri */
        if(genuri != null) {
            String genuriConcatenate = "";
            for(int i=0; i<genuri.size(); i++){
                String gen = genuri.get(i);
                genuriConcatenate += "wd:" + gen;
                if (i < genuri.size() -1) genuriConcatenate += " , ";
            }
            //// ?movie wdt:P136 wd:Q200092 , wd:Q130232.\n
            queryRezultat = queryRezultat
                    .replace("<<<CONDITIE_GENURI>>>", " ?movie wdt:P136 " + genuriConcatenate + ".\n");
        } else{
            queryRezultat = queryRezultat
                    .replace("<<<CONDITIE_GENURI>>>", "");
        }

        /* conditie an */
        if(an != null){
            LocalDateTime primaData = LocalDateTime.of(an,1,1,0,0,0);
            LocalDateTime aDouaData = LocalDateTime.of(an, 12, 31, 0,0,0);

            // " FILTER((?anAparitie >= \"2017-01-01T00:00:00Z\"^^xsd:dateTime) && (?anAparitie <= \"2017-12-31T00:00:00Z\"^^xsd:dateTime))\n" +
            queryRezultat =  queryRezultat
                    .replace("<<<CONDITIE_AN>>>",
                            " FILTER(?anAparitie >= \"" + primaData + "\"^^xsd:dateTime)\n");
        } else {
            queryRezultat = queryRezultat
                    .replace("<<<CONDITIE_AN>>>", "");
        }

        /* conditie scor */
        if(scor != null){
            // " FILTER(xsd:integer(REPLACE(?scorReview, '%', '')) > 85)\n" +
            queryRezultat =  queryRezultat
                    .replace("<<<CONDITIE_SCOR>>>",
                            " FILTER(xsd:integer(REPLACE(?scorReview, '%', '')) > " + scor + ")\n");
        } else {
            queryRezultat = queryRezultat
                    .replace("<<<CONDITIE_SCOR>>>", "");
        }

        return queryRezultat;
    }

    private String getQueryStringDupaGenuri(List<String> genuri) {
//        if(genuri == null) genuri = new ArrayList<>(Arrays.asList("Q130232"));
        if(genuri != null) {
            String genuriConcatenate = "";
            for(int i=0; i<genuri.size(); i++){
                String gen = genuri.get(i);
                genuriConcatenate += "wd:" + gen;
                if (i < genuri.size() -1) genuriConcatenate += " , ";
            }

            return QUERY_FILME_DUPA_GENURI.replace("<<<GENURI>>>", genuriConcatenate);
        }
        return null;
    }

    private String getQueryStringDupaActori(String codActor){
        if(codActor != null) {
            return QUERY_FILME_DUPA_ACTOR.replace("<<<COD_ACTOR>>>", codActor);
        }
        return null;
    }

    private String getQueryStringDupaListaCoduri(List<String> coduriWikiData) {
        if(coduriWikiData != null) {
            String coduriConcatenate = "";
            for(int i=0; i<coduriWikiData.size(); i++){
                String gen = coduriWikiData.get(i);
                coduriConcatenate += " wd:" + gen;
            }

            return QUERY_FILME_DUPA_IDURI.replace("<<<IDURI_WIKIDATA>>>", coduriConcatenate);
        }
        return null;
    }

    private String getConditieSortare(TipSortareEnum tipSortareEnum) {
        String conditieSortare;

        switch (tipSortareEnum){
            case SCOR_ASC: conditieSortare = CONDITIE_SORTARE_SCOR_ASC;
            break;
            case SCOR_DESC: conditieSortare = CONDITIE_SORTARE_SCOR_DESC;
            break;
            case DATA_ASC: conditieSortare = CONDITIE_SORTARE_DATA_ASC;
            break;
            case DATA_DESC: conditieSortare = CONDITIE_SORTARE_DATA_DESC;
            break;
            default: conditieSortare = CONDITIE_SORTARE_SCOR_DESC;
            break;
        }

        return conditieSortare;
    }

    private String executaQuerySPARQL (String querySPQRQL){
        LOG.info("START executaQuerySPARQL");
        LOG.info("QUERY SPARQL =\n {}", querySPQRQL);
        LocalDateTime startTime = LocalDateTime.now();
        String sparqlEndpoint = "https://query.wikidata.org/sparql";
        SPARQLRepository repo = new SPARQLRepository(sparqlEndpoint);

        String userAgent = "Wikidata RDF4J Java Example/0.1 (https://query.wikidata.org/)";
        repo.setAdditionalHttpHeaders( Collections.singletonMap("User-Agent", userAgent ) );
        String raspunsJsonString = "" ;
        try{
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            repo.getConnection().prepareTupleQuery(querySPQRQL).evaluate(new SPARQLResultsJSONWriter(out));
            raspunsJsonString = out.toString();
        } catch ( Exception exception ) {
            exception.printStackTrace();
        }
        LocalDateTime endTime = LocalDateTime.now();
        LOG.info("END executaQuerySPARQL, timp executie= {} seconds", ChronoUnit.SECONDS.between(startTime, endTime));
        return raspunsJsonString;
    }

    private List<FilmWikiData> parseazeListaFilmeDeLaWikiData (String raspunsJsonString)
            throws JsonProcessingException {
        List<FilmWikiData> listaFilme = new ArrayList<>();

        JsonNode jsonNode = objectMapper.readTree(raspunsJsonString);
        JsonNode arrayNode = jsonNode.at("/results/bindings");

        for (JsonNode film : arrayNode){
            FilmWikiData filmWikiData = new FilmWikiData();
            filmWikiData.setCodWikiData(film.at("/movie/value").asText().split("/")[4]);
            filmWikiData.setTitlu(film.at("/titlu/value").asText());
            filmWikiData.setDescriere(film.at("/descriere/value").asText());
            filmWikiData.setUrlImagine(film.at("/urlImagine/value").asText());
            filmWikiData.setGenuri(prelucrareGenuriFilm(film.at("/genuri/value").asText(), film.at("/Idgenuri/value").asText()));
            filmWikiData.setActori(prelucrareActoriFilm(film.at("/actori/value").asText(),film.at("/Idactori/value").asText()));
            filmWikiData.setDurata(film.at("/durata/value").asText());
            filmWikiData.setScorReview(film.at("/scorReview/value").asText().split("; ")[0]);
            filmWikiData.setAnAparitie(film.at("/anAparitie/value").asText().split("-")[0]);
            listaFilme.add(filmWikiData);
        }
        return listaFilme;
    }

    private List<GenFilm> prelucrareGenuriFilm (String genuriFilm, String iduriGenuri) {
        List<String> denumiriGenuri = Arrays.asList(genuriFilm.split("; ")).stream().map(genFilm -> {
            if(genFilm != null && genFilm.contains("film")) return genFilm.replace("film", "").strip();
            return genFilm;
        }).collect(Collectors.toList());

        List<String> coduriGenuri= Arrays.asList(iduriGenuri.split("; ")).stream().map(urlActor -> {
            String[] urlParts =  urlActor.split("/");
            return urlParts[urlParts.length-1];
        }).collect(Collectors.toList());

        List<GenFilm> genuri = new ArrayList<>();
        for ( int i= 0; i< denumiriGenuri.size(); i++){
            GenFilm gen = new GenFilm();
            gen.setDenumireGen(denumiriGenuri.get(i));
            gen.setCodWikiData(coduriGenuri.get(i));
            genuri.add(gen);
        }
        return genuri;
    }

    private List<Actor> prelucrareActoriFilm (String actoriFilm, String iduriActori) {
        List<String> numeActori = Arrays.asList(actoriFilm.split("; "));
        List<String> coduriActori = Arrays.asList(iduriActori.split("; ")).stream().map(urlActor -> {
            String[] urlParts =  urlActor.split("/");
            return urlParts[urlParts.length-1];
        }).collect(Collectors.toList());

        List<Actor> actori = new ArrayList<>();
        for ( int i= 0; i< numeActori.size(); i++){
            Actor actor = new Actor();
            actor.setNumeActor(numeActori.get(i));
            actor.setCodWikiData(coduriActori.get(i));
            actori.add(actor);
        }
        return actori;
    }

    private final static String QUERY_FILME_DUPA_IDURI = "SELECT ?movie ?titlu ?descriere ?anAparitie ?durata ?urlImagine ?scorReview ?director  \n" +
            "(group_concat(distinct ?genreL;separator=\"; \") as ?genuri)\n" +
            "(group_concat(distinct ?genre;separator=\"; \") as ?Idgenuri)\n" +
            "(group_concat(distinct ?castMember;separator=\"; \") as ?actori)\n" +
            "(group_concat(distinct ?castId;separator=\"; \") as ?Idactori)\n" +
            "WHERE {\n" +
            "   { \n" +
            "      SELECT ?movie ?anAparitie ?durata ?genre ?directorId ?scorReview ?urlImagine ?castId WHERE {\n" +
            "   VALUES ?movie {<<<IDURI_WIKIDATA>>>} .  \n" +
            "         ?movie p:P577 [ pq:P291 wd:Q30 ; # place of publication in uniated states for the anAparitie\n" +
            "                   ps:P577 ?anAparitie ].\n" +
            "         ?movie wdt:P2047 ?durata.\n" +
            "         ?movie wdt:P136 ?genre. \n" +
            "         ?movie wdt:P57 ?directorId.\n" +
            "         ?movie p:P444 [ pq:P459 wd:Q108403393;\n" +
            "                         ps:P444 ?scorReview] .\n" +
            "         ?movie wdt:P18 ?urlImagine.  \n" +
            "         ?movie wdt:P161 ?castId.\n" +
            "      }\n" +
            "   }   \n" +
            "  SERVICE wikibase:label { \n" +
            "    bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\". \n" +
            "    ?movie rdfs:label ?titlu.\n" +
            "    ?movie schema:description ?descriere.   \n" +
            "    ?genre rdfs:label ?genreL. \n" +
            "    ?castId rdfs:label ?castMember.\n" +
            "    ?directorId rdfs:label ?director.}\n" +
            "  \n" +
            "} GROUP BY ?movie ?titlu ?descriere ?anAparitie ?durata ?urlImagine ?scorReview ?director ?Idgenuri\n";

    private final static String QUERY_FILME_FILTRE_COMBINATE = "SELECT ?movie ?titlu ?descriere ?anAparitie ?durata ?urlImagine ?scorReview ?director  \n" +
            "(group_concat(distinct ?genreL;separator=\"; \") as ?genuri)\n" +
            "(group_concat(distinct ?genre;separator=\"; \") as ?Idgenuri)\n" +
            "(group_concat(distinct ?castMember;separator=\"; \") as ?actori)\n" +
            "(group_concat(distinct ?castId;separator=\"; \") as ?Idactori)\n" +
            "WHERE {\n" +
            "   { \n" +
            "      SELECT ?movie ?anAparitie ?durata ?genre ?directorId ?scorReview ?urlImagine ?castId WHERE {\n" +
            " <<<CONDITIE_GENURI>>>" +
//            "         ?movie wdt:P136 <<<GENURI>>>.\n" +
            "         ?movie p:P577 [ pq:P291 wd:Q30 ; # place of publication in uniated states for the anAparitie\n" +
            "                   ps:P577 ?anAparitie ].\n" +
            "         ?movie wdt:P2047 ?durata.\n" +
            "         ?movie wdt:P136 ?genre. \n" +
            "         ?movie wdt:P57 ?directorId.\n" +
            "         ?movie p:P444 [ pq:P459 wd:Q108403393;\n" +
            "                         ps:P444 ?scorReview] .\n" +
            "         ?movie wdt:P18 ?urlImagine.  \n" +
            "         ?movie wdt:P161 ?castId.\n" +
            " <<<CONDITIE_AN>>>" +
//            "         FILTER((?anAparitie >= \"2017-01-01T00:00:00Z\"^^xsd:dateTime) && (?anAparitie <= \"2017-12-31T00:00:00Z\"^^xsd:dateTime))" +
            " <<<CONDITIE_SCOR>>>" +
//            "         FILTER(xsd:integer(REPLACE(?scorReview, '%', '')) > 85)\n" +
            "      }\n" +
            " <<<ORDONARE>>>" +
            "  LIMIT 3000\n" +
            "   }   \n" +
            "  SERVICE wikibase:label { \n" +
            "    bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\". \n" +
            "    ?movie rdfs:label ?titlu.\n" +
            "    ?movie schema:description ?descriere.   \n" +
            "    ?genre rdfs:label ?genreL. \n" +
            "    ?castId rdfs:label ?castMember.\n" +
            "    ?directorId rdfs:label ?director.}\n" +
            "  \n" +
            "} GROUP BY ?movie ?titlu ?descriere ?anAparitie ?durata ?urlImagine ?scorReview ?director ?Idgenuri\n";

    private final static String QUERY_FILME_DUPA_GENURI_0 =
            "SELECT ?movie ?titlu ?descriere ?anAparitie ?durata ?urlImagine ?scorReview ?director  \n" +
            "(group_concat(distinct ?genreL;separator=\"; \") as ?genuri)\n" +
            "(group_concat(distinct ?genre;separator=\"; \") as ?Idgenuri)\n" +
            "(group_concat(distinct ?castMember;separator=\"; \") as ?actori)\n" +
            "(group_concat(distinct ?castId;separator=\"; \") as ?Idactori)\n" +
            "WHERE {\n" +
            "   ?movie wdt:P136 <<<GENURI>>>.\n" +
            //?movie wdt:P136 wd:Q200092 , wd:Q130232.
            "   ?movie p:P577 [ pq:P291 wd:Q30 ; # place of publication in uniated states for the anAparitie\n" +
            "                   ps:P577 ?anAparitie ].\n" +
            "   ?movie wdt:P2047 ?durata.\n" +
            "   ?movie wdt:P136 ?genre. \n" +
            "   ?movie wdt:P57 ?directorId.\n" +
            "   ?movie p:P444 [ pq:P459 wd:Q108403393;\n" +
            "                   ps:P444 ?scorReview] .\n" +
            "   ?movie wdt:P18 ?urlImagine.  \n" +
            "   ?movie wdt:P161 ?castId.\n" +
            "  SERVICE wikibase:label { \n" +
            "    bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\". \n" +
            "    ?movie rdfs:label ?titlu.\n" +
            "    ?movie schema:description ?descriere.   \n" +
            "    ?genre rdfs:label ?genreL. \n" +
            "    ?castId rdfs:label ?castMember.\n" +
            "    ?directorId rdfs:label ?director.}\n" +
            "} GROUP BY ?movie ?titlu ?descriere ?anAparitie ?durata ?urlImagine ?scorReview ?director ?Idgenuri\n";

    private final static String QUERY_FILME_DUPA_GENURI = "SELECT ?movie ?titlu ?descriere ?anAparitie ?durata ?urlImagine ?scorReview ?director  \n" +
            "(group_concat(distinct ?genreL;separator=\"; \") as ?genuri)\n" +
            "(group_concat(distinct ?genre;separator=\"; \") as ?Idgenuri)\n" +
            "(group_concat(distinct ?castMember;separator=\"; \") as ?actori)\n" +
            "(group_concat(distinct ?castId;separator=\"; \") as ?Idactori)\n" +
            "WHERE {\n" +
            "   { \n" +
            "      SELECT ?movie ?anAparitie ?durata ?genre ?directorId ?scorReview ?urlImagine ?castId WHERE {\n" +
            "         ?movie wdt:P136 <<<GENURI>>>.\n" +
            // ?movie wdt:P136 wd:Q200092 , wd:Q130232.\n
            "         ?movie p:P577 [ pq:P291 wd:Q30 ; # place of publication in uniated states for the anAparitie\n" +
            "                   ps:P577 ?anAparitie ].\n" +
            "         ?movie wdt:P2047 ?durata.\n" +
            "         ?movie wdt:P136 ?genre. \n" +
            "         ?movie wdt:P57 ?directorId.\n" +
            "         ?movie p:P444 [ pq:P459 wd:Q108403393;\n" +
            "                         ps:P444 ?scorReview] .\n" +
            "         ?movie wdt:P18 ?urlImagine.  \n" +
            "         ?movie wdt:P161 ?castId.\n" +
            "      }\n" +
            "   }   \n" +
            "  SERVICE wikibase:label { \n" +
            "    bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\". \n" +
            "    ?movie rdfs:label ?titlu.\n" +
            "    ?movie schema:description ?descriere.   \n" +
            "    ?genre rdfs:label ?genreL. \n" +
            "    ?castId rdfs:label ?castMember.\n" +
            "    ?directorId rdfs:label ?director.}\n" +
            "  \n" +
            "} GROUP BY ?movie ?titlu ?descriere ?anAparitie ?durata ?urlImagine ?scorReview ?director ?Idgenuri\n";

    private final static String QUERY_FILME_DUPA_ACTOR = "SELECT ?movie ?titlu ?descriere ?anAparitie ?durata ?urlImagine ?scorReview ?director  \n" +
            "(group_concat(distinct ?genreL;separator=\"; \") as ?genuri)\n" +
            "(group_concat(distinct ?genre;separator=\"; \") as ?Idgenuri)\n" +
            "(group_concat(distinct ?castMember;separator=\"; \") as ?actori)\n" +
            "(group_concat(distinct ?castId;separator=\"; \") as ?Idactori)\n" +
            "WHERE {\n" +
            "   { \n" +
            "      SELECT ?movie ?anAparitie ?durata ?genre ?directorId ?scorReview ?urlImagine ?castId WHERE {\n" +
            "   VALUES ?castIdCautare {wd:<<<COD_ACTOR>>>} .  \n" +
            "         ?movie p:P577 [ pq:P291 wd:Q30 ; # place of publication in uniated states for the anAparitie\n" +
            "                   ps:P577 ?anAparitie ].\n" +
            "         ?movie wdt:P2047 ?durata.\n" +
            "         ?movie wdt:P136 ?genre. \n" +
            "         ?movie wdt:P57 ?directorId.\n" +
            "         ?movie p:P444 [ pq:P459 wd:Q108403393;\n" +
            "                         ps:P444 ?scorReview] .\n" +
            "         ?movie wdt:P18 ?urlImagine.  \n" +
            "         ?movie wdt:P161 ?castId.\n" +
            "         ?movie wdt:P161 ?castIdCautare.\n" +
            "      }\n" +
            "   }   \n" +
            "  SERVICE wikibase:label { \n" +
            "    bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\". \n" +
            "    ?movie rdfs:label ?titlu.\n" +
            "    ?movie schema:description ?descriere.   \n" +
            "    ?genre rdfs:label ?genreL. \n" +
            "    ?castId rdfs:label ?castMember.\n" +
            "    ?directorId rdfs:label ?director.}\n" +
            "  \n" +
            "} GROUP BY ?movie ?titlu ?descriere ?anAparitie ?durata ?urlImagine ?scorReview ?director ?Idgenuri\n";

    private final static String QUERY_FILME_TOP_SCOR = "SELECT ?movie ?titlu ?descriere ?anAparitie ?durata ?urlImagine ?scorReview ?director  \n" +
            "(group_concat(distinct ?genreL;separator=\"; \") as ?genuri)\n" +
            "(group_concat(distinct ?genre;separator=\"; \") as ?Idgenuri)\n" +
            "(group_concat(distinct ?castMember;separator=\"; \") as ?actori)\n" +
            "(group_concat(distinct ?castId;separator=\"; \") as ?Idactori)\n" +
            "WHERE {\n" +
            "  ?movie p:P577 [ pq:P291 wd:Q30 ; # place of publication in uniated states for the anAparitie\n" +
            "                  ps:P577 ?anAparitie ].\n" +
            "  ?movie wdt:P2047 ?durata.\n" +
            "  ?movie wdt:P136 ?genre. \n" +
            "  ?movie wdt:P57 ?directorId.\n" +
            "  ?movie p:P444 [ pq:P459 wd:Q108403393;\n" +
            "                  ps:P444 ?scorReview] .\n" +
            "  ?movie wdt:P18 ?urlImagine.  \n" +
            "  ?movie wdt:P161 ?castId.\n" +
            "  SERVICE wikibase:label { \n" +
            "    bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\". \n" +
            "    ?movie rdfs:label ?titlu.\n" +
            "    ?movie schema:description ?descriere.   \n" +
            "    ?genre rdfs:label ?genreL. \n" +
            "    ?castId rdfs:label ?castMember.\n" +
            "    ?directorId rdfs:label ?director.}\n" +
            "} GROUP BY ?movie ?titlu ?descriere ?anAparitie ?durata ?urlImagine ?scorReview ?director ?Idgenuri\n" +
            "ORDER BY desc(?scorReview)\n" +
            "LIMIT 20";

    private final static String QUERY_FILME_CELE_MAI_NOI = "SELECT ?movie ?titlu ?descriere ?anAparitie ?durata ?urlImagine ?scorReview ?director  \n" +
            "(group_concat(distinct ?genreL;separator=\"; \") as ?genuri)\n" +
            "(group_concat(distinct ?genre;separator=\"; \") as ?Idgenuri)\n" +
            "(group_concat(distinct ?castMember;separator=\"; \") as ?actori)\n" +
            "(group_concat(distinct ?castId;separator=\"; \") as ?Idactori)\n" +
            "WHERE {\n" +
            "  ?movie p:P577 [ pq:P291 wd:Q30 ; # place of publication in uniated states for the anAparitie\n" +
            "                  ps:P577 ?anAparitie ].\n" +
            "  ?movie wdt:P2047 ?durata.\n" +
            "  ?movie wdt:P136 ?genre. \n" +
            "  ?movie wdt:P57 ?directorId.\n" +
            "  ?movie p:P444 [ pq:P459 wd:Q108403393;\n" +
            "                  ps:P444 ?scorReview] .\n" +
            "  ?movie wdt:P18 ?urlImagine.  \n" +
            "  ?movie wdt:P161 ?castId.\n" +
            "  SERVICE wikibase:label { \n" +
            "    bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\". \n" +
            "    ?movie rdfs:label ?titlu.\n" +
            "    ?movie schema:description ?descriere.   \n" +
            "    ?genre rdfs:label ?genreL. \n" +
            "    ?castId rdfs:label ?castMember.\n" +
            "    ?directorId rdfs:label ?director.}\n" +
            "} GROUP BY ?movie ?titlu ?descriere ?anAparitie ?durata ?urlImagine ?scorReview ?director ?Idgenuri\n" +
            "ORDER BY desc(?anAparitie)\n" +
            "LIMIT 20";

    private final static String CONDITIE_SORTARE_SCOR_DESC = "ORDER BY asc(xsd:integer(REPLACE(?scorReview, '%', '')))\n";
    private final static String CONDITIE_SORTARE_SCOR_ASC = "ORDER BY desc(xsd:integer(REPLACE(?scorReview, '%', '')))\n";
    private final static String CONDITIE_SORTARE_DATA_DESC = "ORDER BY asc(?anAparitie)\n";
    private final static String CONDITIE_SORTARE_DATA_ASC = "ORDER BY desc(?anAparitie)\n";

    private final static String LIMITA_FILME =  "LIMIT 20";
}
