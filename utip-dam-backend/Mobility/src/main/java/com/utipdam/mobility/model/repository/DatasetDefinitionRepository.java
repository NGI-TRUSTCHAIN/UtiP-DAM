package com.utipdam.mobility.model.repository;

import com.utipdam.mobility.model.entity.DatasetDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DatasetDefinitionRepository extends JpaRepository<DatasetDefinition, UUID> {
    List<DatasetDefinition> findAllByOrderByUpdatedOnDesc();
    List<DatasetDefinition> findAllByUserIdOrderByUpdatedOnDesc(@Param("userId") Long userId);
    Optional<DatasetDefinition> findById(@Param("id") UUID id);
    DatasetDefinition findByName(@Param("name") String name);
}
