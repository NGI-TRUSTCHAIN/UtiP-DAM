package com.utipdam.mobility.model.entity;


import java.io.Serializable;
import java.util.UUID;

public class LocationId implements Serializable {
    private Integer id;
    private UUID datasetDefinitionId;


    public LocationId() {

    }

    public LocationId(Integer id, UUID datasetDefinitionId){
        this.id = id;
        this.datasetDefinitionId = datasetDefinitionId;
    }
}
