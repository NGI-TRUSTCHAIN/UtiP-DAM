package com.utipdam.mobility.model;

import lombok.Data;

import java.sql.Date;
import java.util.UUID;

@Data
public class DatasetDTO {
    private UUID id;
    private UUID datasetDefinitionId;
    private Date startDate;
    private Date endDate;
    private String resolution;
    private Integer k;
    private Long dataPoints;

    public DatasetDTO() {
    }

}
