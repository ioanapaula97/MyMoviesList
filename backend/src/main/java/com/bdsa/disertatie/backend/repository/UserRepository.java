package com.bdsa.disertatie.backend.repository;

import com.bdsa.disertatie.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
