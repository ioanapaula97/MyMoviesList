package com.bdsa.disertatie.backend.entity;


import com.bdsa.disertatie.backend.enums.StatusFilmEnum;

import javax.persistence.*;

@Entity
@Table(name = "film",
       uniqueConstraints = {@UniqueConstraint(name = "unique_cod_wiki_data",
                            columnNames = {"user_id","codWikiData"})})
public class Film extends BaseEntity{

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;
    @Column(nullable = false)
    private String codWikiData;
    @Column(columnDefinition="BOOLEAN DEFAULT false", nullable = false)
    private Boolean esteFavorit;
    @Enumerated(EnumType.STRING) //pentru a salva valoarea textuala din enum (nu codul)
    private StatusFilmEnum statusFilm;
    private Integer notaFilm;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getCodWikiData() {
        return codWikiData;
    }

    public void setCodWikiData(String codWikiData) {
        this.codWikiData = codWikiData;
    }

    public Boolean getEsteFavorit() {
        return esteFavorit;
    }

    public void setEsteFavorit(Boolean esteFavorit) {
        this.esteFavorit = esteFavorit;
    }

    public StatusFilmEnum getStatusFilm() {
        return statusFilm;
    }

    public void setStatusFilm(StatusFilmEnum statusFilm) {
        this.statusFilm = statusFilm;
    }

    public Integer getNotaFilm() {
        return notaFilm;
    }

    public void setNotaFilm(Integer notaFilm) {
        this.notaFilm = notaFilm;
    }
}
