package com.utipdam.mobility.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity(name = "order_item_dataset")
@Data
public class OrderItemDataset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "order_item_id")
    private Integer orderItemId;

    @Column(name = "dataset_id")
    private UUID datasetId;

    public OrderItemDataset() {
    }

    public OrderItemDataset(Integer orderItemId, UUID datasetId) {
        this.orderItemId = orderItemId;
        this.datasetId = datasetId;
    }
}
