package com.bdsa.disertatie.backend;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@Configuration
public class SiteFrontendApp {
    private static final Logger LOG = LoggerFactory.getLogger(SiteFrontendApp.class);

    @Value("${backend.url}")
    private String backendUrl;

    @Value("${healthcheck.error.status}")
    private int healthcheckErrorStatus;

    public static void main(String[] args) {
        SpringApplication.run(SiteFrontendApp.class, args);
    }

    @Bean
    public CommandLineRunner runner() {
        return args -> LOG.info("CommandLineRunner.run(...****...");
    }

    @Controller
    @RequestMapping
    class ForwardController {
        @GetMapping(value = {"/{path:[^\\.]*}", "/*/{path:[^\\.]*}"})
        public String redirect() {
            // Forward to home page so that route is preserved and handled by angular
            LOG.info("forward to index.html");
            return "forward:/index.html";
        }
    }

    @RestController
    @RequestMapping(path = "api/v1")
    class TestController {
        @GetMapping
                public ResponseEntity<String> test() {
            return ResponseEntity.ok("ok");
        }

        @GetMapping("healthcheck")
        public ResponseEntity<String> healthCheck() {
            RestTemplate restTemplate = new RestTemplate();

            try{
                restTemplate.getForEntity(backendUrl, String.class);
                LOG.info("healthcheck status: 200");
                return test();
            } catch (Exception exception) {
                LOG.info("healthcheck error: {}", exception.getMessage());
                LOG.info("healthcheck status: {}", healthcheckErrorStatus);
                return new ResponseEntity<>(HttpStatus.valueOf(healthcheckErrorStatus));
            }
        }

    }
}
