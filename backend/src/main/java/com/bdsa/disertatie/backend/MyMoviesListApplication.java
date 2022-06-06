package com.bdsa.disertatie.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@EnableConfigurationProperties
@SpringBootApplication(scanBasePackages = { "com.bdsa.disertatie.backend" })
public class MyMoviesListApplication {

	public static void main(String[] args) {
		SpringApplication.run(MyMoviesListApplication.class, args);
	}

}
