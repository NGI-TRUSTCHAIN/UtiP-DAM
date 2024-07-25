package com.utipdam.mobility.model;

import lombok.Data;

import java.util.UUID;

@Data
public class FileUploadResponse {
    private UUID datasetDefinitionId;
    private UUID datasetId;
    private String fileName;
    private long size;
 
    // getters and setters are not shown for brevity
 
}