package com.bdsa.disertatie.backend.service;


import com.bdsa.disertatie.backend.dto.UserDto;
import com.bdsa.disertatie.backend.entity.Utilizator;
import com.bdsa.disertatie.backend.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    private static final Logger LOG = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public UserService(UserRepository userRepository, ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
    }

    public UserDto getUserDupaAdresaEmailSauSalveazaNouUser(String adresaEmail){
        Utilizator entity = userRepository.findByUsername(adresaEmail);

        if(entity == null) {
            Utilizator nouUser = new Utilizator();
            nouUser.setUsername(adresaEmail);
            nouUser.setCreated(LocalDateTime.now());
            nouUser.setVersion(LocalDateTime.now());
            entity = this.userRepository.save(nouUser);
        }
        return mapToDto(entity);
    }

    public UserDto mapToDto (Utilizator entity){
        return modelMapper.map(entity, UserDto.class);
    }




    public List<UserDto> totiUserii(){
        return userRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }



}
