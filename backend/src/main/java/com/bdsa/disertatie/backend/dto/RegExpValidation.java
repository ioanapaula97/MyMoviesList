package com.bdsa.disertatie.backend.dto;

public class RegExpValidation {
    public static final String TEXT_CAUTARE = "^[a-zA-ZÀ-ÿĀ-ž-0-9-\\s]{0,30}$";
    public static final String EMAIL = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
    public static final String LITERE_SI_NUMERE = "^[a-zA-Z0-9]{0,10}$";
}
