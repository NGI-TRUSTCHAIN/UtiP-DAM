package com.utipdam.mobility.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity(name = "location")
@IdClass(LocationId.class)
@Data
public class Location {
    @Id
    @Column(name = "id")
    private Integer id;

    @Id
    @Column(name = "dataset_definition_id")
    private UUID datasetDefinitionId;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "coordinates")
    private String coordinates;

    public Location() {
    }


    public Location(Integer id, UUID datasetDefinitionId, String name, String description, String coordinates) {
        this.id = id;
        this.datasetDefinitionId = datasetDefinitionId;
        this.name = name;
        this.description = description;
        this.coordinates = coordinates;
    }


    public void update(Location location) {
        if (location.getName() != null) {
            this.name = location.getName();
        }
        if (location.getDescription() != null) {
            this.description = location.getDescription();
        }
        if (location.getCoordinates() != null) {
            this.coordinates = location.getCoordinates();
        }
    }

}
