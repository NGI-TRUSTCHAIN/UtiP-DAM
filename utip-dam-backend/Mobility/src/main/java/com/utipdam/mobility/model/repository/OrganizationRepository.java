package com.utipdam.mobility.model.repository;

import com.utipdam.mobility.model.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrganizationRepository extends JpaRepository<Organization, UUID> {
    List<Organization> findAll();
    Optional<Organization> findById(@Param("id") UUID id);
    Organization findByNameAndEmail(@Param("name") String name, @Param("email") String email);
    Organization findByName(@Param("name") String name);
}
