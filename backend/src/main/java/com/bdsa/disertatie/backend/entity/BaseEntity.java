package com.bdsa.disertatie.backend.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@MappedSuperclass //pentru a mosteni proprietatile catre entitatile copil si a genera coloanele in tabelele asociate
public abstract class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime created = LocalDateTime.now();
    @Version
    private LocalDateTime version;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getCreated() {
        return created;
    }

    public void setCreated(LocalDateTime created) {
        this.created = created;
    }

    public LocalDateTime getVersion() {
        return version;
    }

    public void setVersion(LocalDateTime version) {
        this.version = version;
    }
}
