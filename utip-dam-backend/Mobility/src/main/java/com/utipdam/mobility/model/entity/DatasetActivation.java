package com.utipdam.mobility.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.UUID;

@Entity(name = "dataset_activation")
@Data
public class DatasetActivation {
    @Id
    @Column(name = "payment_detail_id")
    private Integer paymentDetailId;

    @Column(name = "order_item_id")
    private Integer orderItemId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "api_key")
    private UUID apiKey;

    @Column(name = "expiration_date")
    private Date expirationDate;

    @Column(name = "dataset_owner_id")
    private Long datasetOwnerId;

    private boolean active = true;

    @Column(name = "created_at")
    private Timestamp createdAt = new Timestamp(System.currentTimeMillis());

    @Column(name = "modified_at")
    private Timestamp modifiedAt;

}
