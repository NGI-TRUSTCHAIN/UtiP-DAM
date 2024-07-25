package com.utipdam.mobility.model.repository;

import com.utipdam.mobility.model.entity.Role;
import com.utipdam.mobility.model.entity.ERole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}