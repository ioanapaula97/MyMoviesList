package com.bdsa.disertatie.backend.service;

import ai.onnxruntime.*;
import com.bdsa.disertatie.backend.dto.*;
import com.fasterxml.jackson.core.JsonProcessingException;
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
import java.util.*;
import java.util.stream.Collectors;

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
//        String question = "which person directed the movies starred by Johnny Depp";

        InputModelQA inputModelQA = new InputModelQA();
//        inputModelQA.setQuestion(new long[]{0,1,5,3,8,27,6,7});
//        inputModelQA.setHead(17077L);
//        inputModelQA.setLength(new long[]{8});
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

        List<Long> encoded_question = new ArrayList();
        for (String word : question_words) {
            encoded_question.add( Long.valueOf(word2idx.get(word).toString()));
        }
        long[] _question = new long[encoded_question.size()];
        for( int i=0; i<encoded_question.size(); i++)
            _question[i] = encoded_question.get(i);

        long _head = Long.valueOf(entity2idx.get(head.strip()).toString()) ;
        long[] _length = new long[]{encoded_question.size()};

        // Suppose the networks returns 35474
        String result = (String) idx2entity.get("35474");
        LOG.info("result= {}", result);

        inputModelQA.setQuestion(_question);
        inputModelQA.setHead(_head);
        inputModelQA.setLength(_length);

        return inputModelQA;
    }

    public RaspunsModelQA prelucreazaRaspuns (float[] values){
        List<ScoruriQA> listaScoruri =  new ArrayList<>();

        if(values != null) {
            for(int i=0; i< values.length; i++){
                ScoruriQA scorQA = new ScoruriQA();
                scorQA.setScor(values[i]);
                scorQA.setRaspuns(idx2entity.get(String.valueOf(i)).toString());

                listaScoruri.add(scorQA);
            }
        }

        //sortare descrescator dupa scor
        Collections.sort(listaScoruri, new Comparator<ScoruriQA>() {
            @Override
            public int compare(ScoruriQA o1, ScoruriQA o2) {
                return Float.compare(o2.getScor(), o1.getScor());
            }
        });

        //returnez primele 5 raspunsuri
        RaspunsModelQA raspunsModelQA = new RaspunsModelQA();
        raspunsModelQA.setRaspuns(listaScoruri.stream().limit(5).map(ScoruriQA::getRaspuns).collect(Collectors.joining(" <br><br> ")));

        return raspunsModelQA;
    }

    public RaspunsModelQA getRaspunsIntrebare(String intrebare) throws OrtException {
        InputModelQA inputModelQA = prelucreazaIntrebare(intrebare);

        Map<String, OnnxTensor> container = new HashMap<>();

        /* tensor intrebare*/
        LongBuffer intrebareBuffer = LongBuffer
                .wrap(inputModelQA.getQuestion(), 0, inputModelQA.getQuestion().length).asReadOnlyBuffer();
        OnnxTensor intrebareTensor = OnnxTensor.createTensor(env, intrebareBuffer, new long[]{inputModelQA.getQuestion().length});
        container.put("question", intrebareTensor);

        /* tensor length*/
        LongBuffer lengthBuffer = LongBuffer
                .wrap(inputModelQA.getQuestion(), 0, inputModelQA.getLength().length).asReadOnlyBuffer();
        OnnxTensor lengthTensor = OnnxTensor.createTensor(env, lengthBuffer, new long[]{inputModelQA.getLength().length});
        container.put("length", lengthTensor);

        /* tensor head*/
        OnnxTensor headTensor = OnnxTensor.createTensor(env, inputModelQA.getHead());
        container.put("head", headTensor);

        float[] values; long[] indices;
        // Apelare model QA
        try (OrtSession.Result results = session.run(container)) {
            values = ((float[][])results.get("scores").get().getValue())[0];
//            indices = ((long[][])results.get("indices").get().getValue())[0];
        }

        return prelucreazaRaspuns(values);
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
}
