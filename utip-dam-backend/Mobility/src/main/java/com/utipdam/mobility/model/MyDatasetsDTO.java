package com.utipdam.mobility.model;

import lombok.Data;

import java.util.UUID;

@Data
public class MyDatasetsDTO {

    private UUID datasetDefinitionId;
    private String name;
    private String countryCode;
    private String city;
    private String description;
    private Double fee;
    private Boolean publish;
    private Boolean internal;
    private String updatedOn;

    public MyDatasetsDTO() {
    }

    public MyDatasetsDTO(String name, String description,
                         String countryCode, String city, Double fee, Boolean publish,
                         UUID datasetDefinitionId, String updatedOn, Boolean internal) {
        this.datasetDefinitionId = datasetDefinitionId;
        this.name = name;
        this.description = description;
        this.countryCode = countryCode;
        this.city = city;
        this.fee = fee;
        this.publish = publish;
        this.internal = internal;
        this.updatedOn = updatedOn;
    }
}
