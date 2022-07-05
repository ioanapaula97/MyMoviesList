package com.bdsa.disertatie.backend.service;

import ai.onnxruntime.*;
import com.bdsa.disertatie.backend.dto.FilmRecomandat;
import com.bdsa.disertatie.backend.dto.FilmWikiData;
import com.bdsa.disertatie.backend.entity.Film;
import com.bdsa.disertatie.backend.entity.Utilizator;
import com.bdsa.disertatie.backend.repository.FilmRepository;
import com.bdsa.disertatie.backend.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.nio.FloatBuffer;
import java.nio.LongBuffer;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ModelRecomandariService {
    private static final Logger LOG = LoggerFactory.getLogger(ModelRecomandariService.class);

    @Value("${recomandariModelPath}")
    private String recomandariModelPath;

    private OrtSession session;
    private OrtEnvironment env;

    private FilmRepository filmRepository;
    private UserRepository userRepository;
    private FilmWikidataService filmWikidataService;

    @Value("#{${mapaCoduriModelRecomandariSiWikidata}}")
    private Map<String,String> mapaCoduriModelRecomandariSiWikidata;

    @Autowired
    public ModelRecomandariService(FilmRepository filmRepository, UserRepository userRepository, FilmWikidataService filmWikidataService) {
        this.filmRepository = filmRepository;
        this.userRepository = userRepository;
        this.filmWikidataService = filmWikidataService;
    }

    @PostConstruct
    private void init() {
        LOG.info("init ModelRecomandariService");
        LOG.info("mapaCoduriModelRecomandariSiWikidata = {}", mapaCoduriModelRecomandariSiWikidata);
        try {
            env = OrtEnvironment.getEnvironment();
            session = env.createSession(recomandariModelPath,new OrtSession.SessionOptions());
            LOG.info("Model input names: {}", session.getInputNames());
            LOG.info("Model input info: {}", session.getInputInfo());

        } catch (OrtException e) {
            LOG.error("OrtException, message= {}", e.getMessage());
        }
    }

    public List<FilmWikiData> getRecomandariFilme(Long userId) throws OrtException, JsonProcessingException {
//        List<Integer> userIds = new ArrayList<>(Arrays.asList(1,1,1,1,1,1));
//        List<Integer> filmeIds = new ArrayList<>(Arrays.asList(8,143,175,285,203,400));
        Utilizator utilizator = userRepository.findById(userId).get();

        List<String> coduriWikiDataFilmeVazute = filmRepository.findAllByUtilizator(utilizator)
                .stream().map(Film::getCodWikiData).collect(Collectors.toList());

        List<Float> idsModelRecomandariFilmeNevazute = new ArrayList<>();
        List<Float> userIds = new ArrayList<>();

        //construire lista id-uri filme nevazute
        for (Map.Entry<String, String> entry : mapaCoduriModelRecomandariSiWikidata.entrySet()) {
            String codWikiData = entry.getValue();
            if (!coduriWikiDataFilmeVazute.contains(codWikiData)) {
                idsModelRecomandariFilmeNevazute.add(Float.parseFloat(entry.getKey()));
                userIds.add(0f); // (id-ul din modelul de recomandari)
            }
        }

        Map<String, OnnxTensor> container = new HashMap<>();

        //creare tensor vector utilizatori
        float[] arrayUseri = new float[userIds.size()];
        for(int i = 0; i < userIds.size(); i++) arrayUseri[i] = userIds.get(i);
        final FloatBuffer idsUseriBuffer = FloatBuffer.wrap(arrayUseri,0,userIds.size()).asReadOnlyBuffer();
        OnnxTensor iduriUseriTensor = OnnxTensor.createTensor(env, idsUseriBuffer , new long[]{userIds.size(),1});

        //creare tensor vector id-uri filme
        float[] arrayFilme = new float[idsModelRecomandariFilmeNevazute.size()];
        for(int i = 0; i < idsModelRecomandariFilmeNevazute.size(); i++) arrayFilme[i] = idsModelRecomandariFilmeNevazute.get(i);
        final FloatBuffer idsFilmeBuffer = FloatBuffer.wrap(arrayFilme,0,idsModelRecomandariFilmeNevazute.size()).asReadOnlyBuffer();
        OnnxTensor iduriFilmeTensor = OnnxTensor.createTensor(env, idsFilmeBuffer , new long[]{idsModelRecomandariFilmeNevazute.size(),1});

        container.put("user", iduriUseriTensor);
        container.put("movie", iduriFilmeTensor);

        float[][] resultValues = null;
        // Run the inference (apelare model recomandari)
        try (OrtSession.Result results = session.run(container)) {

            LOG.info("Outputs: {}", results.get(0).getValue());
            resultValues = ((float[][])results.get("dense_3").get().getValue());
        }

        return prelucrareOutputModelRecomandari(resultValues, arrayFilme);
    }

    List<FilmWikiData> prelucrareOutputModelRecomandari(float[][] resultValues, float[] arrayFilmeInput) throws JsonProcessingException {
        List<FilmRecomandat> filmeRecomandate =  new ArrayList<>();

        //construire lista cu id-uri wikidata si scor in functie de id-ul asociat din model
        if(resultValues != null) {
            for(int i=0; i< resultValues.length; i++){
                FilmRecomandat filmRecomandat = new FilmRecomandat();
                filmRecomandat.setScorModel(resultValues[i][0]);
                filmRecomandat.setCodWikiData(mapaCoduriModelRecomandariSiWikidata.get(String.valueOf((int)arrayFilmeInput[i])));
                filmeRecomandate.add(filmRecomandat);
            }
        }

        //sortare descrescator dupa scor
        Collections.sort(filmeRecomandate, Comparator.comparing(FilmRecomandat::getScorModel).reversed());

        //preluare date de la wikidata despre filmele recomandate
        List<FilmWikiData> filmeWikiData = filmWikidataService
                .getFilmeDupaListaCoduri(filmeRecomandate.stream().map(FilmRecomandat::getCodWikiData).limit(5).collect(Collectors.toList()));

        //returnez primele 10 filme gasite
        return filmeWikiData.stream().limit(10).collect(Collectors.toList());
    }
}
