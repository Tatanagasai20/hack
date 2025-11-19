package com.traffic_service.auth_service.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.traffic_service.auth_service.model.AppUser;

import java.util.Optional;

public interface UserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByUsername(String username);
}
