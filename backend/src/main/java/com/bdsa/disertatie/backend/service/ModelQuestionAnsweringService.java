package com.bdsa.disertatie.backend.service;

import ai.onnxruntime.*;
import com.bdsa.disertatie.backend.dto.InputModelQA;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import org.eclipse.rdf4j.query.algebra.Str;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.nio.DoubleBuffer;
import java.nio.FloatBuffer;
import java.nio.LongBuffer;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ModelQuestionAnsweringService {
    private static final Logger LOG = LoggerFactory.getLogger(ModelQuestionAnsweringService.class);

    @Value("${questionAnsweringModelPath}")
    private String questionAnsweringModelPath;

    private OrtSession session;
    private OrtEnvironment env;

    @Value("${word2idx}")
    String fileWord2idx = "word2idx.json";
    @Value("${entity2idx}")
    String fileEntity2idx = "entity2idx.json";
    @Value("${idx2entity}")
    String fileIdx2entity = "idx2entity.json";
    Map<String, Object> word2idx;
    Map<String, Object> entity2idx;
    Map<String, Object> idx2entity;

    public ModelQuestionAnsweringService() {}

    @PostConstruct
    private void init(){
        LOG.info("init QuestionAnsweringService");
        try {
            // creare sesiune Onnx Runtime
            env = OrtEnvironment.getEnvironment();
            session = env.createSession(questionAnsweringModelPath,new OrtSession.SessionOptions());
            LOG.info("Model input names: {}", session.getInputNames());
            LOG.info("Model input info: {}", session.getInputInfo());

            //citire dictionare pentru prelucrare intrebare
            word2idx = citireDictionare(fileWord2idx);
            entity2idx = citireDictionare(fileEntity2idx);
            idx2entity = citireDictionare(fileIdx2entity);

        } catch (OrtException e) {
            LOG.error("OrtException, message= {}", e.getMessage());
        }
    }

    public InputModelQA prelucreazaIntrebare(String question){
        InputModelQA inputModelQA = new InputModelQA();
        inputModelQA.setQuestion(new long[]{0,1,5,3,8,27,6,7});
        inputModelQA.setHead(17077L);
        inputModelQA.setLength(new long[]{8});

        String match = "";
        for (String key : entity2idx.keySet()) {
            if (question.contains(key)) {
                if (match.length() < key.length())
                    match = key;
            }
        }
        question = question.replace(match, String.format("[%s]", match));
        String[] data_line = question.strip().split("\t");
        String[] question_data = data_line[0].split("\\[");
        String question_1 = question_data[0];
        String[] question_2 = question_data[1].split("\\]");
        String head = question_2[0].strip();
        String question_replaced = "";
        if (question_2.length == 1)
            question_replaced = question_1 + "NE";
        else
            question_replaced = question_1 + "NE" + question_2[1];
        String[] question_words = question_replaced.strip().split(" ");

        List<Double> encoded_question = new ArrayList();
        for (String word : question_words) {
            encoded_question.add((Double) word2idx.get(word));
        }
        int length_question = encoded_question.size();

        Double head_embed = (Double) entity2idx.get(head.strip());
        // head_tensor = TODO: tensor for onnx
        // question_tensor = TODO: tensor for onnx
        // question_length_tensor = TODO: tensor for onnx

        System.out.println("Program finished gracefuly!");
        // Suppose the networks returns 35474
        String result = (String) idx2entity.get("35474");

        System.out.println(result);


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

    public static void test_qa(String question) {
//        String fileWord2idx = "word2idx.json";
//        String fileEntity2idx = "entity2idx.json";
//        String fileIdx2entity = "idx2entity.json";
//        Map<String, Object> word2idx = citireDictionare(fileWord2idx);
//        Map<String, Object> entity2idx = citireDictionare(fileEntity2idx);
//        Map<String, Object> idx2entity = citireDictionare(fileIdx2entity);

//        String question = "which person directed the movies starred by Johnny Depp";

        String match = "";
        for (String key : entity2idx.keySet()) {
            if (question.contains(key)) {
                if (match.length() < key.length())
                    match = key;
            }
        }
        question = question.replace(match, String.format("[%s]", match));
        String[] data_line = question.strip().split("\t");
        String[] question_data = data_line[0].split("\\[");
        String question_1 = question_data[0];
        String[] question_2 = question_data[1].split("\\]");
        String head = question_2[0].strip();
        String question_replaced = "";
        if (question_2.length == 1)
            question_replaced = question_1 + "NE";
        else
            question_replaced = question_1 + "NE" + question_2[1];
        String[] question_words = question_replaced.strip().split(" ");

        List<Double> encoded_question = new ArrayList();
        for (String word : question_words) {
            encoded_question.add((Double) word2idx.get(word));
        }
        int length_question = encoded_question.size();

        Double head_embed = (Double) entity2idx.get(head.strip());
        // head_tensor = TODO: tensor for onnx
        // question_tensor = TODO: tensor for onnx
        // question_length_tensor = TODO: tensor for onnx

        System.out.println("Program finished gracefuly!");
        // Suppose the networks returns 35474
        String result = (String) idx2entity.get("35474");

        System.out.println(result);
    }

    public static Map<String, Object> citireDictionare(String path) {

        String jsonString;
        try {
            jsonString = new String(Files.readAllBytes(Paths.get(path)));
            Map<String, Object> dictionary = new Gson().fromJson(jsonString, new TypeToken<HashMap<String, String>>() {
            }.getType());
            return dictionary;
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return null;
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

public class App {

    public static void test_qa() {
        String fileWord2idx = "word2idx.json";
        String fileEntity2idx = "entity2idx.json";
        String fileIdx2entity = "idx2entity.json";
        Map<String, Object> word2idx = getDictionary(fileWord2idx);
        Map<String, Object> entity2idx = getDictionary(fileEntity2idx);
        Map<String, Object> idx2entity = getDictionary(fileIdx2entity);

        String question = "which person directed the movies starred by Johnny Depp";

        String match = "";
        for (String key : entity2idx.keySet()) {
            if (question.contains(key)) {
                if (match.length() < key.length())
                    match = key;
            }
        }
        question = question.replace(match, String.format("[%s]", match));
        String[] data_line = question.strip().split("\t");
        String[] question_data = data_line[0].split("\\[");
        String question_1 = question_data[0];
        String[] question_2 = question_data[1].split("\\]");
        String head = question_2[0].strip();
        String question_replaced = "";
        if (question_2.length == 1)
            question_replaced = question_1 + "NE";
        else
            question_replaced = question_1 + "NE" + question_2[1];
        String[] question_words = question_replaced.strip().split(" ");

        List<Double> encoded_question = new ArrayList();
        for (String word : question_words) {
            encoded_question.add((Double) word2idx.get(word));
        }
        int length_question = encoded_question.size();

        Double head_embed = (Double) entity2idx.get(head.strip());
        // head_tensor = TODO: tensor for onnx
        // question_tensor = TODO: tensor for onnx
        // question_length_tensor = TODO: tensor for onnx

        System.out.println("Program finished gracefuly!");
        // Suppose the networks returns 35474
        String result = (String) idx2entity.get("35474");

        System.out.println(result);
    }

    private static final Logger LOG = LoggerFactory.getLogger(App.class);

    public static void main(String[] args) {

        // test_qa();
        try {
            test_recommendations();
        } catch (OrtException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

    }

    private static void test_recommendations() throws OrtException {
        OrtEnvironment env = OrtEnvironment.getEnvironment();
        String recomandariModelPath = "recommender_updated.onnx";
        OrtSession session = env.createSession(recomandariModelPath, new OrtSession.SessionOptions());

        Map<String, OnnxTensor> container = new HashMap<>();

        // FloatBuffer idsUseriBuffer = FloatBuffer.allocate(userIds.size());
        // for (float userId: userIds) idsUseriBuffer.put(userId);
        // OnnxTensor iduriUseriTensor = OnnxTensor.createTensor(env, idsUseriBuffer ,
        // new long[]{userIds.size(),1});
        List<Integer> userIds = new ArrayList<Integer>(); // TODO: repeat the same user Id for al lthe movies not seen
        userIds.add(1);
        userIds.add(3);
        List<Integer> filmeIds = new ArrayList<Integer>(); // TODO eliminate the movies from the database from movies of
        // the model
        filmeIds.add(1);
        filmeIds.add(3);

        assert filmeIds.size() == userIds.size();

        float[] arrayUseri = new float[userIds.size()];
        for (int i = 0; i < userIds.size(); i++)
            arrayUseri[i] = userIds.get(i);
        final FloatBuffer idsUseriBuffer = FloatBuffer.wrap(arrayUseri, 0, userIds.size()).asReadOnlyBuffer();
        OnnxTensor iduriUseriTensor = OnnxTensor.createTensor(env, idsUseriBuffer, new long[] { userIds.size(), 1 });

        // FloatBuffer idsFilmeBuffer = FloatBuffer.allocate(userIds.size());
        // for (int filmId: filmeIds) idsFilmeBuffer.put(filmId);
        // OnnxTensor iduriFilmeTensor = OnnxTensor.createTensor(env, idsFilmeBuffer ,
        // new long[]{userIds.size(),1});

        float[] arrayFilme = new float[filmeIds.size()];
        for (int i = 0; i < filmeIds.size(); i++)
            arrayFilme[i] = filmeIds.get(i);
        final FloatBuffer idsFilmeBuffer = FloatBuffer.wrap(arrayFilme, 0, filmeIds.size()).asReadOnlyBuffer();
        OnnxTensor iduriFilmeTensor = OnnxTensor.createTensor(env, idsFilmeBuffer, new long[] { filmeIds.size(), 1 });

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

    public static Map<String, String> getDictionary(String path) {

        String jsonString;
        try {
            jsonString = new String(Files.readAllBytes(Paths.get(path)));
            Map<String, String> dictionary = new Gson().fromJson(jsonString, new TypeToken<HashMap<String, String>>() {
            }.getType());
            return dictionary;
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return null;
    }
}
