package com.bdsa.disertatie.backend.service;

import com.bdsa.disertatie.backend.dto.FilmWikiData;
import com.bdsa.disertatie.backend.enums.TipSortareEnum;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.eclipse.rdf4j.query.algebra.Str;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.eclipse.rdf4j.query.resultio.sparqljson.SPARQLResultsJSONWriter;
import org.eclipse.rdf4j.repository.sparql.SPARQLRepository;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class FilmWikidataService {

    //sortare: scor, data, box_office
    //filtre: genuri, an, varsta

    private final ObjectMapper objectMapper;

    @Autowired
    public FilmWikidataService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public List<FilmWikiData> getFilmeDupaGen(List<String> genuri, TipSortareEnum tipSortare) throws JsonProcessingException {
        String querySPARQL = getQueryStringDupaGenuri(genuri) + getConditieSortare(tipSortare) + LIMITA_FILME;
        String raspunsJsonString = executaQuerySPARQL(querySPARQL);
        List<FilmWikiData> lista = parseazeListaFilmeDeLaWikiData(raspunsJsonString);

        return lista;
    }

    public List<FilmWikiData> getFilmeDupaAnAparitie(Integer an, TipSortareEnum tipSortare) throws JsonProcessingException {
        String querySPARQL = getQueryStringDupaAnAparitie(an) + getConditieSortare(tipSortare) + LIMITA_FILME;
        String raspunsJsonString = executaQuerySPARQL(querySPARQL);
        List<FilmWikiData> lista = parseazeListaFilmeDeLaWikiData(raspunsJsonString);

        return lista;
    }

    public List<FilmWikiData> getFilmeDupaVarstaPermisa(String varsta, TipSortareEnum tipSortare) throws JsonProcessingException {
        String querySPARQL = getQueryStringDupaVarsta(varsta) + getConditieSortare(tipSortare) + LIMITA_FILME;
        String raspunsJsonString = executaQuerySPARQL(querySPARQL);
        List<FilmWikiData> lista = parseazeListaFilmeDeLaWikiData(raspunsJsonString);

        return lista;
    }

    public List<FilmWikiData> getFilmeTopBoxOffice (){
        return getFilmeSortat(TipSortareEnum.BOX_OFFICE);
    }

    public List<FilmWikiData> getFilmeTopScor () throws JsonProcessingException {
        String raspunsJsonString = executaQuerySPARQL(QUERY_FILME_TOP_SCOR);
        List<FilmWikiData> lista = parseazeListaFilmeDeLaWikiData(raspunsJsonString);

        return lista;
    }

    private List<FilmWikiData> getFilmeSortat (TipSortareEnum tipSortareEnum){
        List<FilmWikiData> lista = new ArrayList<>();

        return lista;
    }

    private String getQueryStringDupaGenuri(List<String> genuri) {
        if(genuri == null) genuri = new ArrayList<>(Arrays.asList("Q130232"));

        String genuriConcatenate = "";
        for(int i=0; i<genuri.size(); i++){
            String gen = genuri.get(i);
            genuriConcatenate += "wd:" + gen;
            if (i < genuri.size() -1) genuriConcatenate += " , ";
        }

        return QUERY_FILME_DUPA_GENURI.replace("<<<GENURI>>>", genuriConcatenate);
    }

    private String getQueryStringDupaAnAparitie(Integer an) {
        if(an == null) an = LocalDateTime.now().getYear();

        LocalDateTime primaData = LocalDateTime.of(an,1,1,0,0,0);
        LocalDateTime aDouaData = LocalDateTime.of(an, 12, 31, 0,0,0);

        String query =  QUERY_FILME_DUPA_AN_APARITIE.replace("<<<PRIMA_DATA>>>", primaData.toString());
        return  query.replace("<<<A_DOUA_DATA>>>", aDouaData.toString());
    }


    private String getQueryStringDupaVarsta(String varsta) {
        if(varsta == null) varsta = "Q18665344";

        return  QUERY_FILME_DUPA_VARSTA.replace("<<<VARSTA>>>",varsta);
    }

    private String getConditieSortare(TipSortareEnum tipSortareEnum) {
        if(tipSortareEnum.equals(TipSortareEnum.SCOR_ASC)) return CONDITIE_SORTARE_SCOR_ASC;
        return CONDITIE_SORTARE_SCOR_DESC;
    }

    private String executaQuerySPARQL (String querySPQRQL){
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

        return raspunsJsonString;
    }

    private List<FilmWikiData> parseazeListaFilmeDeLaWikiData (String raspunsJsonString) throws JsonProcessingException {
        List<FilmWikiData> listaFilme = new ArrayList<>();

        JsonNode jsonNode = objectMapper.readTree(raspunsJsonString);
        JsonNode arrayNode = jsonNode.at("/results/bindings");

        for (JsonNode film : arrayNode){
            FilmWikiData filmWikiData = new FilmWikiData();
            filmWikiData.setCodWikiData(film.at("/movie/value").asText().split("/")[4]);
            filmWikiData.setTitlu(film.at("/titlu/value").asText());
            filmWikiData.setDescriere(film.at("/descriere/value").asText());
            filmWikiData.setUrlImagine(film.at("/urlImagine/value").asText());
            filmWikiData.setGenuri(Arrays.asList(film.at("/genuri/value").asText().split("; ")));
            filmWikiData.setDurata(film.at("/durata/value").asText());
            filmWikiData.setScorReview(film.at("/scorReview/value").asText().split("; ")[0]);
            filmWikiData.setAnAparitie(film.at("/anAparitie/value").asText().split("-")[0]);
            listaFilme.add(filmWikiData);
        }

        return listaFilme;
    }

    private final static String QUERY_FILME_DUPA_GENURI = "SELECT ?movie ?titlu ?descriere ?anAparitie ?durata ?urlImagine ?scorReview  \n" +
            "(group_concat(distinct ?genreL;separator=\"; \") as ?genuri)\n" +
            "WHERE {\n" +
            "   ?movie wdt:P136 <<<GENURI>>>.\n" +
            "   ?movie p:P577 [ pq:P291 wd:Q30 ; # place of publication in uniated states for the anAparitie\n" +
            "                   ps:P577 ?anAparitie ].\n" +
            "   ?movie wdt:P2047 ?durata.\n" +
            "   ?movie wdt:P136 ?genre. \n" +
            "   ?movie p:P444 [ pq:P459 wd:Q108403393;\n" +
            "                   ps:P444 ?scorReview] .\n" +
            "   ?movie wdt:P18 ?urlImagine.  \n" +
            "  SERVICE wikibase:label { \n" +
            "    bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\". \n" +
            "    ?movie rdfs:label ?titlu.\n" +
            "    ?movie schema:description ?descriere.   \n" +
            "    ?genre rdfs:label ?genreL. }\n" +
            "} GROUP BY ?movie ?titlu ?descriere ?anAparitie ?durata ?urlImagine ?scorReview\n";

    private final static String QUERY_FILME_DUPA_AN_APARITIE = "SELECT ?movie ?titlu ?descriere ?anAparitie ?durata ?urlImagine ?scorReview \n" +
            "(group_concat(distinct ?genreL;separator=\"; \") as ?genuri)\n" +
            "WHERE {\n" +
            "   ?movie p:P577 [ pq:P291 wd:Q30 ; # place of publication in uniated states for the anAparitie\n" +
            "                   ps:P577 ?anAparitie ].\n" +
            "   ?movie wdt:P2047 ?durata.\n" +
            "   ?movie wdt:P136 ?genre. \n" +
            "   ?movie p:P444 [ pq:P459 wd:Q108403393;\n" +
            "                   ps:P444 ?scorReview] .\n" +
            "   ?movie wdt:P18 ?urlImagine.\n" +
            "#    ?movie p:2142 [].\n" +
            "#    ?statement pq:3005 wd:Q30. # place of boxoffice is unitated states\n" +
            "#    ?statement ps:2142 ?boxOffice.\n" +
            "  SERVICE wikibase:label { \n" +
            "    bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\". \n" +
            "    ?movie rdfs:label ?titlu.\n" +
            "    ?movie schema:description ?descriere.   \n" +
            "    ?genre rdfs:label ?genreL. }\n" +
            "  FILTER((?anAparitie >= \"<<<PRIMA_DATA>>>\"^^xsd:dateTime) && (?anAparitie <= \"<<<A_DOUA_DATA>>>\"^^xsd:dateTime))\n" +
            "} GROUP BY ?movie ?titlu ?descriere ?anAparitie ?durata ?urlImagine ?scorReview\n";

    private final static String QUERY_FILME_DUPA_VARSTA = "SELECT ?movie ?titlu ?descriere ?anAparitie ?durata ?urlImagine ?scorReview \n" +
            "(group_concat(distinct ?genreL;separator=\"; \") as ?genuri)\n" +
            "WHERE {\n" +
            "   VALUES ?varsta {wd:<<<VARSTA>>>} .  \n" +
            "   ?movie wdt:P1657 ?varsta .  # Restricted MPAA movies\n" +
            "   ?movie p:P577 [ pq:P291 wd:Q30 ; # place of publication in uniated states for the anAparitie\n" +
            "                   ps:P577 ?anAparitie ].\n" +
            "   ?movie wdt:P2047 ?durata.\n" +
            "   ?movie wdt:P136 ?genre. \n" +
            "   ?movie p:P444 [ pq:P459 wd:Q108403393;\n" +
            "                   ps:P444 ?scorReview] .\n" +
            "   ?movie wdt:P18 ?urlImagine.\n" +
            "#    ?movie p:2142 [].\n" +
            "#    ?statement pq:3005 wd:Q30. # place of boxoffice is unitated states\n" +
            "#    ?statement ps:2142 ?boxOffice.\n" +
            "  SERVICE wikibase:label { \n" +
            "    bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\". \n" +
            "    ?movie rdfs:label ?titlu.\n" +
            "    ?movie schema:description ?descriere.   \n" +
            "    ?genre rdfs:label ?genreL. }\n" +
            "} GROUP BY ?movie ?titlu ?descriere ?anAparitie ?durata ?urlImagine ?scorReview\n";

    private final static String QUERY_FILME_TOP_SCOR = "SELECT ?movie ?titlu ?descriere ?anAparitie ?durata ?urlImagine ?scorReview \n" +
            "(group_concat(distinct ?genreL;separator=\"; \") as ?genuri)\n" +
            "WHERE {\n" +
            "   ?movie p:P577 [ pq:P291 wd:Q30 ; # place of publication in uniated states for the anAparitie\n" +
            "                   ps:P577 ?anAparitie ].\n" +
            "   ?movie wdt:P2047 ?durata.\n" +
            "   ?movie wdt:P136 ?genre. \n" +
            "   ?movie p:P444 [ pq:P459 wd:Q108403393;\n" +
            "                   ps:P444 ?scorReview] .\n" +
            "   ?movie wdt:P18 ?urlImagine.\n" +
            "\n" +
            "  SERVICE wikibase:label { \n" +
            "    bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\". \n" +
            "    ?movie rdfs:label ?titlu.\n" +
            "    ?movie schema:description ?descriere.   \n" +
            "    ?genre rdfs:label ?genreL. }\n" +
            "} GROUP BY ?movie ?titlu ?descriere ?anAparitie ?durata ?urlImagine ?scorReview\n" +
            "ORDER BY desc(?scorReview)\n" +
            "LIMIT 20";


    private final static String CONDITIE_SORTARE_SCOR_DESC = "ORDER BY desc(?scorReview)\n";
    private final static String CONDITIE_SORTARE_SCOR_ASC = "ORDER BY asc(?scorReview)\n";
    private final static String CONDITIE_SORTARE_DATA_DESC = "";
    private final static String CONDITIE_SORTARE_BOX_OFFICE_DESC = "";
    private final static String LIMITA_FILME =  "LIMIT 20";







    //        String querySelect = "#Movies released in 2017\n" +
//                "SELECT DISTINCT ?item ?itemLabel WHERE {\n" +
//                "  ?item wdt:P31 wd:Q11424.\n" +
//                "  ?item wdt:P577 ?pubdate.\n" +
//                "  FILTER((?pubdate >= \"2017-01-01T00:00:00Z\"^^xsd:dateTime) && (?pubdate <= \"2017-12-31T00:00:00Z\"^^xsd:dateTime))\n" +
//                "  SERVICE wikibase:label { bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\". }\n" +
//                "} \n" +
//                "LIMIT 20";

}
