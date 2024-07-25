package com.utipdam.mobility.business;

import com.utipdam.mobility.config.BusinessService;
import com.utipdam.mobility.exception.DefaultException;
import com.utipdam.mobility.model.entity.Location;
import com.utipdam.mobility.model.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


@BusinessService
public class LocationBusiness {
    @Autowired
    private LocationService locationService;

    public Optional<Location> getById(Integer id, UUID datasetDefinitionId) {
        return locationService.findById(id, datasetDefinitionId);
    }

    public List<Location> getByDatasetDefinitionId(UUID datasetDefinitionId) {
        return locationService.findByDatasetDefinitionId(datasetDefinitionId);
    }


    public Location save(Location location){
        return locationService.save(location);
    }

    public Location update(Integer id, UUID datasetDefinitionId, Location location) throws DefaultException {
        if (id == null) {
            throw new DefaultException("id can not be null");
        }
        Optional<Location> ds = locationService.findById(id, datasetDefinitionId);
        if (ds.isPresent()){
            ds.get().update(location);
            return locationService.save(ds.get());
        }else{
            return null;
        }
    }

}
