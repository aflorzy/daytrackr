package com.aflorzy.daytrackr.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aflorzy.daytrackr.domain.Role;

public interface RoleRepository extends JpaRepository<Role, Integer> {
  Optional<Role> findByName(String name);
}
