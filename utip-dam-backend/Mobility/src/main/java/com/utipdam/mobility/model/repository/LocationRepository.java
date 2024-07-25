package com.utipdam.mobility.model.repository;

import com.utipdam.mobility.model.entity.Location;
import com.utipdam.mobility.model.entity.LocationId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface LocationRepository extends JpaRepository<Location, LocationId> {
    List<Location> findByDatasetDefinitionId(@Param("datasetDefinitionId") UUID datasetDefinitionId);

}
