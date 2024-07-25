package com.utipdam.mobility.model.service;


import com.utipdam.mobility.model.entity.Location;
import com.utipdam.mobility.model.entity.LocationId;
import com.utipdam.mobility.model.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Service
public class LocationService {
    private final LocationRepository locationRepository;

    @Autowired
    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }
    public Optional<Location> findById(Integer id, UUID datasetDefinitionId) {
        LocationId locationId = new LocationId(id, datasetDefinitionId);
        return locationRepository.findById(locationId);
    }

    public List<Location> findByDatasetDefinitionId(UUID datasetDefinitionId) {
        return locationRepository.findByDatasetDefinitionId(datasetDefinitionId);
    }
    public Location save(Location datasetDefinition) {
        return locationRepository.save(datasetDefinition);
    }
}
