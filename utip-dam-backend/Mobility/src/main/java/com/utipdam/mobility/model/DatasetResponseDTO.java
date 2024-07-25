package com.utipdam.mobility.model;

import com.utipdam.mobility.model.entity.Organization;
import com.utipdam.mobility.model.entity.Vendor;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class DatasetResponseDTO {

    private UUID datasetDefinitionId;
    private String name;
    private String countryCode;
    private String city;
    private String description;
    private Double fee;
    private Boolean publish;
    private Boolean internal;
    private Organization datasetOwner;
    private List<DatasetListDTO> datasets;
    private Long dataPoints;
    private Long userId;
    private Integer downloadCount;
    private String updatedOn;
    private boolean publishMDS = false;
    private String publishedOn;
    private Double fee1d;
    private Double fee3mo;
    private Double fee6mo;
    private Double fee12mo;
    private Vendor vendor;

    public DatasetResponseDTO() {
    }

    public DatasetResponseDTO(String name, String description,
                              String countryCode, String city, Double fee, Boolean publish,
                              Organization organization, UUID datasetDefinitionId,
                              String updatedOn, Long dataPoints, List<DatasetListDTO> datasets,
                              Long userId, Boolean internal, Integer downloadCount, Boolean publishMDS,
                              String publishedOn, Double fee1d, Double fee3mo, Double fee6mo, Double fee12mo,
                              Vendor vendor) {
        this.datasetDefinitionId = datasetDefinitionId;
        this.name = name;
        this.description = description;
        this.countryCode = countryCode;
        this.city = city;
        this.fee = fee;
        this.publish = publish;
        this.internal = internal;
        this.datasetOwner = organization;
        this.datasets = datasets;
        this.dataPoints = dataPoints;
        this.userId = userId;
        this.downloadCount = downloadCount;
        this.updatedOn = updatedOn;
        this.publishMDS = publishMDS;
        this.publishedOn = publishedOn;
        this.fee1d = fee1d;
        this.fee3mo = fee3mo;
        this.fee6mo = fee6mo;
        this.fee12mo = fee12mo;
        this.vendor = vendor;
    }
}
