package com.utipdam.mobility.model;

import lombok.Data;

import java.sql.Date;
import java.util.List;
import java.util.UUID;

@Data
public class OrderDTO {
    private Long userId;
    private UUID datasetDefinitionId;
    private List<UUID> datasetIds;
    private String description;
    private boolean selectedDate = false;
    private boolean pastDate = false;
    private boolean futureDate = false;
    private String currency;
    private Double totalAmount;
    private Integer monthLicense;
    private String paymentStatus;
    private String paymentId;
    private String payerId;
    private String paymentSource;

    public OrderDTO() {
    }

}
