package com.bdsa.disertatie.backend.service;

import ai.onnxruntime.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.nio.LongBuffer;
import java.util.HashMap;
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

    public void getRecomandariFilme() throws OrtException {
        Map<String, OnnxTensor> container = new HashMap<>();

        OnnxTensor intrebareTensor = OnnxTensor.createTensor(env, LongBuffer.allocate(8), new long[]{8});
        container.put("question", intrebareTensor);

        // Run the inference
        try (OrtSession.Result results = session.run(container)) {

            // Only iterates once
            for (Map.Entry<String, OnnxValue> r : results) {
                OnnxValue resultValue = r.getValue();
                OnnxTensor resultTensor = (OnnxTensor) resultValue;
                resultTensor.getValue();
                LOG.info("Output Name: {}", r.getKey());
                LOG.info("Output Value: {}, {}", r.getValue(), resultTensor);
            }
        }
    }
}
