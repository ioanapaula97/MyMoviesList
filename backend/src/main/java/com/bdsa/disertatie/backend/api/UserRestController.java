package com.bdsa.disertatie.backend.api;

import com.bdsa.disertatie.backend.dto.UserDto;
import com.bdsa.disertatie.backend.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping(value = "api/v1/user")
@Validated
public class UserRestController {
    private static final Logger LOG = LoggerFactory.getLogger(UserRestController.class);
    private final UserService userService;

    @Autowired
    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(value = "/{adresaEmail}")
    public ResponseEntity<UserDto> getUserDupaAdresaEmail (@PathVariable String adresaEmail){
        LOG.info("GET user dupa email, adresaEmail={}", adresaEmail);
        return ResponseEntity.ok().body(userService.getUserDupaAdresaEmailSauSalveazaNouUser(adresaEmail));
    }

    @GetMapping(value = "/toti")
    public ResponseEntity<List<UserDto>> totiUserii (){
        LOG.info("GET toti userii");
        List<UserDto> useri = userService.totiUserii();
        return ResponseEntity.ok().body(useri);
    }



}
