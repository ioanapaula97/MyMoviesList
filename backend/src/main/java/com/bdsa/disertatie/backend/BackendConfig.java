package com.bdsa.disertatie.backend;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;

@Configuration
public class BackendConfig {
    private static final Logger LOG = LoggerFactory.getLogger(BackendConfig.class);

    @PostConstruct
    private void init(){
        LOG.info("init {}", getClass().getSimpleName());
    }

    @Bean
    @ConditionalOnMissingBean(ModelMapper.class)
    public ModelMapper modelMapper(){
        return new ModelMapper();
    }
}
