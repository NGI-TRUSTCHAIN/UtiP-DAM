package com.utipdam.mobility.model;

import lombok.Data;

import java.util.UUID;

@Data
public class LicenseResponseDTO {
    private Integer id;
    private UUID datasetDefinitionId;
    private String datasetName;
    private String datasetDescription;
    private Long datasetOwnerId;
    private boolean selectedDate = false;
    private boolean pastDate = false;
    private boolean futureDate = false;
    private Integer monthLicense;
    private Long userId;
    private String username;
    private String transactionDate;
    private boolean active = false;
    private String licenseStartDate;
    private String licenseEndDate;
    private String paymentStatus;
    private String purchaseMethod;
    private Double amount;


    public LicenseResponseDTO() {
    }

    public LicenseResponseDTO(Integer id, UUID datasetDefinitionId, String datasetName,
                              String datasetDescription, Long datasetOwnerId,
                              boolean selectedDate, boolean pastDate,
                              boolean futureDate, Integer monthLicense,
                              Long userId, String username, String transactionDate,
                              boolean active, String licenseStartDate, String licenseEndDate,
                              String paymentStatus, String purchaseMethod, Double amount) {
        this.id = id;
        this.datasetDefinitionId = datasetDefinitionId;
        this.datasetName = datasetName;
        this.datasetDescription = datasetDescription;
        this.datasetOwnerId = datasetOwnerId;
        this.selectedDate = selectedDate;
        this.pastDate = pastDate;
        this.futureDate = futureDate;
        this.monthLicense = monthLicense;
        this.userId = userId;
        this.username = username;
        this.transactionDate = transactionDate;
        this.active = active;
        this.licenseStartDate = licenseStartDate;
        this.licenseEndDate = licenseEndDate;
        this.paymentStatus = paymentStatus;
        this.purchaseMethod = purchaseMethod;
        this.amount = amount;
    }
}
