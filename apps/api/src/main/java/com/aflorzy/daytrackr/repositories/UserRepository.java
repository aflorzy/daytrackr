package com.aflorzy.daytrackr.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aflorzy.daytrackr.domain.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, UUID> {
  Optional<UserEntity> findByUsername(String username);
  Boolean existsByUsername(String username);
}
