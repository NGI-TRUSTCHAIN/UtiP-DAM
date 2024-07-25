package com.utipdam.mobility.model;

import lombok.Data;

import java.util.UUID;

@Data
public class LicenseDTO {
    private UUID datasetDefinitionId;
    private String description;
    private boolean pastDate = false;
    private boolean futureDate = false;
    private Integer monthLicense;
    private String recipientEmail;
    private String licenseStartDate;
    private String licenseEndDate;


    public LicenseDTO() {
    }

}
