package com.bdsa.disertatie.backend.entity;

import javax.persistence.*;

@Entity
@Table(name = "site_user",
       uniqueConstraints = {@UniqueConstraint(name = "unique_username", columnNames = {"username"})})
public class Utilizator extends BaseEntity {

    private String username;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

}
