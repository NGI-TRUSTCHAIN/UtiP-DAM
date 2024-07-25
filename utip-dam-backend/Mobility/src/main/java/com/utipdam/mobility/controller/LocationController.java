package com.utipdam.mobility.controller;

import com.utipdam.mobility.business.LocationBusiness;
import com.utipdam.mobility.exception.DefaultException;
import com.utipdam.mobility.model.entity.Location;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
public class LocationController {
    private static final Logger logger = LoggerFactory.getLogger(LocationController.class);

    @Autowired
    private LocationBusiness locationBusiness;

    @GetMapping("/locations/{datasetDefinitionId}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable UUID datasetDefinitionId) {
        Map<String, Object> response = new HashMap<>();

        response.put("data", locationBusiness.getByDatasetDefinitionId(datasetDefinitionId));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @GetMapping("/location/{datasetDefinitionId}/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable UUID datasetDefinitionId, @PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();

        response.put("data", locationBusiness.getById(id, datasetDefinitionId));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/location")
    public ResponseEntity<Map<String, Object>> save(@RequestBody Location location) {
        Map<String, Object> response = new HashMap<>();
        if (location.getId() == null) {
            logger.error("Id is required");
            response.put("error", "Id is required");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        if (location.getDatasetDefinitionId() == null) {
            logger.error("Dataset definition id is required");
            response.put("error", "Dataset definition id is required");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        if (location.getName() == null) {
            logger.error("Name is required");
            response.put("error", "Name is required");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }


        Optional<Location> loc = locationBusiness.getById(location.getId(), location.getDatasetDefinitionId());

        if (loc.isPresent()) {
            logger.error("Id already exists. Please choose another.");
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }else{
            response.put("data", locationBusiness.save(location));
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/location/{datasetDefinitionId}/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable UUID datasetDefinitionId, @PathVariable Integer id,
                                                      @RequestBody Location location) throws DefaultException {
        Map<String, Object> response = new HashMap<>();
        response.put("data", locationBusiness.update(id, datasetDefinitionId, location));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}