package com.utipdam.mobility.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity(name = "order_detail")
@Data
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "payment_id")
    private Integer paymentId;

    @Column(name = "total")
    private Double total;

    @Column(name = "created_at")
    private Timestamp createdAt = new Timestamp(System.currentTimeMillis());

    @Column(name = "modified_at")
    private Timestamp modifiedAt;


    public OrderDetail() {
    }

    public OrderDetail(Long userId, Integer paymentId, Double total) {
        this.userId = userId;
        this.paymentId = paymentId;
        this.total = total;
    }

    public void update(OrderDetail orderDetail) {
        if (orderDetail.getPaymentId() != null) {
            this.paymentId = orderDetail.getPaymentId();
        }
        if (orderDetail.getTotal() != null) {
            this.total = orderDetail.getTotal();
        }
    }

}
