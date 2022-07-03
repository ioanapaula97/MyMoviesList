package com.bdsa.disertatie.backend.service;

import ai.onnxruntime.*;
import com.bdsa.disertatie.backend.dto.InputModelQA;
import org.eclipse.rdf4j.query.algebra.Str;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.nio.DoubleBuffer;
import java.nio.FloatBuffer;
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

    public InputModelQA prelucreazaIntrebare(String intrebare){
         ///blasblasdas
        InputModelQA inputModelQA = new InputModelQA();
        inputModelQA.setQuestion(new long[]{0,1,5,3,8,27,6,7});
        inputModelQA.setHead(17077L);
        inputModelQA.setLength(new long[]{8});
        return inputModelQA;
    }

    public String prelucreazaRaspuns (float[] values, long[] indices){
        ///blasblasdas
        return "";
    }

    public String getRaspunsIntrebare(String intrebare) throws OrtException {
        InputModelQA inputModelQA = prelucreazaIntrebare(intrebare);

        Map<String, OnnxTensor> container = new HashMap<>();

        LongBuffer intrebareBuffer = LongBuffer
                .wrap(inputModelQA.getQuestion(), 0, inputModelQA.getQuestion().length).asReadOnlyBuffer();
        OnnxTensor intrebareTensor = OnnxTensor.createTensor(env, intrebareBuffer, new long[]{inputModelQA.getQuestion().length});
        container.put("question", intrebareTensor);

        LongBuffer lengthBuffer = LongBuffer
                .wrap(inputModelQA.getQuestion(), 0, inputModelQA.getLength().length).asReadOnlyBuffer();
        OnnxTensor lengthTensor = OnnxTensor.createTensor(env, lengthBuffer, new long[]{inputModelQA.getLength().length});
        container.put("length", lengthTensor);

        OnnxTensor headTensor = OnnxTensor.createTensor(env, inputModelQA.getHead());
        container.put("head", headTensor);

        float[] values; long[] indices;
        // Apelare model QA
        try (OrtSession.Result results = session.run(container)) {
            values = ((float[][])results.get("values").get().getValue())[0];
            indices = ((long[][])results.get("indices").get().getValue())[0];
        }
        return prelucreazaRaspuns(values, indices);
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
}
