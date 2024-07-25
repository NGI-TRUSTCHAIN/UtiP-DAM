package com.utipdam.mobility.model;

import lombok.Data;

import java.sql.Date;
import java.util.UUID;

@Data
public class DatasetListDTO {

    private UUID id;
    private String resolution;
    private Date fileDate;
    //private Date endDate;
    private Integer k;
    private Long dataPoints;
    private String updatedOn;

    public DatasetListDTO() {
    }

    public DatasetListDTO(UUID id, String resolution,
                          Date fileDate, Date endDate, Integer k,
                          Long dataPoints, String updatedOn) {
        this.id = id;
        this.resolution = resolution;
        this.fileDate = fileDate;
        //this.endDate = endDate;
        this.k = k;
        this.dataPoints = dataPoints;
        this.updatedOn = updatedOn;
    }
}
