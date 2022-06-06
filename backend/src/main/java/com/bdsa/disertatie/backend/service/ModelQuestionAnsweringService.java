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
public class ModelQuestionAnsweringService {
    private static final Logger LOG = LoggerFactory.getLogger(ModelQuestionAnsweringService.class);

    @Value("${questionAnsweringModelPath}")
    private String questionAnsweringModelPath;

    private OrtSession session;
    private OrtEnvironment env;

    public ModelQuestionAnsweringService() {}

    @PostConstruct
    private void init(){
        LOG.info("init QuestionAnsweringService");
        try {
            env = OrtEnvironment.getEnvironment();
            session = env.createSession(questionAnsweringModelPath,new OrtSession.SessionOptions());
            LOG.info("Model input names: {}", session.getInputNames());
            LOG.info("Model input info: {}", session.getInputInfo());

        } catch (OrtException e) {
            LOG.error("OrtException, message= {}", e.getMessage());
        }
    }


    public String getRaspunsIntrebare(String intrebare) throws OrtException {
        String raspuns = "";

        Map<String, OnnxTensor> container = new HashMap<>();

        OnnxTensor intrebareTensor = OnnxTensor.createTensor(env, LongBuffer.allocate(8), new long[]{8});
        container.put("question", intrebareTensor);

        OnnxTensor lengthTensor = OnnxTensor.createTensor(env, LongBuffer.allocate(1), new long[]{1});
        container.put("length", lengthTensor);

        OnnxTensor headTensor = OnnxTensor.createTensor(env, 0L);
        container.put("head", headTensor);
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

//        Map<String, LongBuffer> inputDataMap = new TreeMap<>(){{ put("question", LongBuffer.allocate(8)); put("head", LongBuffer.allocate(1)); put("length", LongBuffer.allocate(1));}};
//        Iterator<Map.Entry<String, NodeInfo>> nodeInfoIterator = inputInfoMap.entrySet().iterator();
//        Iterator<long[]> inputDataIterator = inputDataMap.values().iterator();
//        while (nodeInfoIterator.hasNext()){
//            Map.Entry<String, NodeInfo> entry = nodeInfoIterator.next();
//            NodeInfo nodeInfo = entry.getValue();
//            long[] inputData = inputDataMap.get(entry.getKey());
//            long[] shape = ((TensorInfo) nodeInfo.getInfo()).getShape();
//            Object tensorData = OrtUtil.reshape(inputData, shape);
//            OnnxTensor inputTensor = OnnxTensor.createTensor(env, tensorData);

//
//        OnnxTensor question, head, length;
//        long[] dimensions = new long[]{8};
//        LongBuffer sourceData = FloatBuffer.wrap(Array(1.0f));
//        question = OnnxTensor.createTensor(env, sourceData, dimensions);
//        var inputs = Map.of("question",question,"head",head, "length", length);
//        try (var results = session.run(inputs)) {
//            // manipulate the results
//            LOG.info("QA model result = {}", results);
//        } catch (OrtException e) {
//            e.printStackTrace();
//        }
        return raspuns;
    }

}
