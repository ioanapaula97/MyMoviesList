package com.bdsa.disertatie.backend.service;

import ai.onnxruntime.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.nio.FloatBuffer;
import java.nio.LongBuffer;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ModelRecomandariService {
    private static final Logger LOG = LoggerFactory.getLogger(ModelRecomandariService.class);

    @Value("${recomandariModelPath}")
    private String recomandariModelPath;

    private OrtSession session;
    private OrtEnvironment env;


    @PostConstruct
    private void init() {
        LOG.info("init ModelRecomandariService");
        try {
            env = OrtEnvironment.getEnvironment();
            session = env.createSession(recomandariModelPath,new OrtSession.SessionOptions());
            LOG.info("Model input names: {}", session.getInputNames());
            LOG.info("Model input info: {}", session.getInputInfo());

        } catch (OrtException e) {
            LOG.error("OrtException, message= {}", e.getMessage());
        }
    }

    public void getRecomandariFilme(List<Integer> userIds, List<Integer>filmeIds) throws OrtException {
        Map<String, OnnxTensor> container = new HashMap<>();

//        FloatBuffer idsUseriBuffer = FloatBuffer.allocate(userIds.size());
//        for (float userId: userIds) idsUseriBuffer.put(userId);
//        OnnxTensor iduriUseriTensor = OnnxTensor.createTensor(env, idsUseriBuffer , new long[]{userIds.size(),1});

        float[] arrayUseri = new float[userIds.size()];
        for(int i = 0; i < userIds.size(); i++) arrayUseri[i] = userIds.get(i);
        final FloatBuffer idsUseriBuffer = FloatBuffer.wrap(arrayUseri,0,6).asReadOnlyBuffer();
        OnnxTensor iduriUseriTensor = OnnxTensor.createTensor(env, idsUseriBuffer , new long[]{userIds.size(),1});


//        FloatBuffer idsFilmeBuffer = FloatBuffer.allocate(userIds.size());
//        for (int filmId: filmeIds) idsFilmeBuffer.put(filmId);
//        OnnxTensor iduriFilmeTensor = OnnxTensor.createTensor(env, idsFilmeBuffer , new long[]{userIds.size(),1});

        float[] arrayFilme = new float[filmeIds.size()];
        for(int i = 0; i < filmeIds.size(); i++) arrayFilme[i] = filmeIds.get(i);
        final FloatBuffer idsFilmeBuffer = FloatBuffer.wrap(arrayFilme,0,6).asReadOnlyBuffer();
        OnnxTensor iduriFilmeTensor = OnnxTensor.createTensor(env, idsFilmeBuffer , new long[]{filmeIds.size(),1});

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
