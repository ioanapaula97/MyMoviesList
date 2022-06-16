package com.bdsa.disertatie.backend.repository;

import com.bdsa.disertatie.backend.entity.Utilizator;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<Utilizator, Long> {
}
