package com.utipdam.mobility.model;

import com.utipdam.mobility.model.entity.Organization;
import com.utipdam.mobility.model.entity.Server;
import lombok.Data;

@Data
public class DatasetDefinitionDTO {
    private String name;
    private String description;
    private String countryCode;
    private String city;
    private Double fee;
    private Organization organization;
    private boolean publish = false;
    private boolean internal = false;
    private Integer k;
    private String resolution = "daily";
    private Long userId;
    private Server server;
    private boolean publishMDS = false;
    private String publishedOn;
    private Double fee1d;
    private Double fee3mo;
    private Double fee6mo;
    private Double fee12mo;

    public DatasetDefinitionDTO() {
    }

}
