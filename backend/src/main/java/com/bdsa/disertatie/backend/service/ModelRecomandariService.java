package com.bdsa.disertatie.backend.service;

import ai.onnxruntime.*;
import com.bdsa.disertatie.backend.entity.Film;
import com.bdsa.disertatie.backend.entity.Utilizator;
import com.bdsa.disertatie.backend.repository.FilmRepository;
import com.bdsa.disertatie.backend.repository.UserRepository;
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

    @Value("#{${mapaCoduriModelRecomandariSiWikidata}}")
    private Map<String,String> mapaCoduriModelRecomandariSiWikidata;

    @Autowired
    public ModelRecomandariService(FilmRepository filmRepository, UserRepository userRepository) {
        this.filmRepository = filmRepository;
        this.userRepository = userRepository;
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

    public void getRecomandariFilme(Long userId) throws OrtException {
//        List<Integer> userIds = new ArrayList<>(Arrays.asList(1,1,1,1,1,1));
//        List<Integer> filmeIds = new ArrayList<>(Arrays.asList(8,143,175,285,203,400));
        Utilizator utilizator = userRepository.getById(userId);

        List<String> coduriWikiDataFilmeVazute = filmRepository.findAllByUtilizator(utilizator)
                .stream().map(Film::getCodWikiData).collect(Collectors.toList());

        List<Float> idsModelRecomandariFilmeNevazute = new ArrayList<>();
        List<Float> userIds = new ArrayList<>();

        for (Map.Entry<String, String> entry : mapaCoduriModelRecomandariSiWikidata.entrySet()) {
            String codWikiData = entry.getValue();
            if (!coduriWikiDataFilmeVazute.contains(codWikiData)) {
                idsModelRecomandariFilmeNevazute.add(Float.parseFloat(entry.getKey()));
               userIds.add(0f); // (id-ul din modelul de recomandari)
            }
        }

        Map<String, OnnxTensor> container = new HashMap<>();

//        FloatBuffer idsUseriBuffer = FloatBuffer.allocate(userIds.size());
//        for (float userId: userIds) idsUseriBuffer.put(userId);
//        OnnxTensor iduriUseriTensor = OnnxTensor.createTensor(env, idsUseriBuffer , new long[]{userIds.size(),1});

        float[] arrayUseri = new float[userIds.size()];
        for(int i = 0; i < userIds.size(); i++) arrayUseri[i] = userIds.get(i);
        final FloatBuffer idsUseriBuffer = FloatBuffer.wrap(arrayUseri,0,userIds.size()).asReadOnlyBuffer();
        OnnxTensor iduriUseriTensor = OnnxTensor.createTensor(env, idsUseriBuffer , new long[]{userIds.size(),1});


//        FloatBuffer idsFilmeBuffer = FloatBuffer.allocate(userIds.size());
//        for (int filmId: filmeIds) idsFilmeBuffer.put(filmId);
//        OnnxTensor iduriFilmeTensor = OnnxTensor.createTensor(env, idsFilmeBuffer , new long[]{userIds.size(),1});

        float[] arrayFilme = new float[idsModelRecomandariFilmeNevazute.size()];
        for(int i = 0; i < idsModelRecomandariFilmeNevazute.size(); i++) arrayFilme[i] = idsModelRecomandariFilmeNevazute.get(i);
        final FloatBuffer idsFilmeBuffer = FloatBuffer.wrap(arrayFilme,0,idsModelRecomandariFilmeNevazute.size()).asReadOnlyBuffer();
        OnnxTensor iduriFilmeTensor = OnnxTensor.createTensor(env, idsFilmeBuffer , new long[]{idsModelRecomandariFilmeNevazute.size(),1});

        container.put("user", iduriUseriTensor);
        container.put("movie", iduriFilmeTensor);

        // Run the inference
        try (OrtSession.Result results = session.run(container)) {

            LOG.info("Outputs: {}", results.get(0).getValue());
            // Only iterates once
            for (Map.Entry<String, OnnxValue> r : results) {
                OnnxValue resultValue = r.getValue();
                OnnxTensor resultTensor = (OnnxTensor) resultValue;
                resultTensor.getValue();
                LOG.info("Output Name: {}", r.getKey());
                LOG.info("Output Value: {}, {}", r.getValue(), resultTensor);
                LOG.info("Output Value: {}, {}", r.getValue(), resultTensor);
            }
        }
    }
}
