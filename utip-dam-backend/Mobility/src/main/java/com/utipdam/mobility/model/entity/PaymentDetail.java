package com.utipdam.mobility.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Date;
import java.sql.Timestamp;

@Entity(name = "payment_detail")
@Data
public class PaymentDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "order_id")
    private Integer orderId;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "description")
    private String description;

    @Column(name = "status")
    private String status;

    @Column(name = "currency")
    private String currency;

    @Column(name = "balance_transaction")
    private String balanceTransaction;

    @Column(name = "payer_id")
    private String payerId;

    @Column(name = "payment_id")
    private String paymentId;

    @Column(name = "payment_source")
    private String paymentSource;

    @Column(name = "created_at")
    private Timestamp createdAt = new Timestamp(System.currentTimeMillis());

    @Column(name = "modified_at")
    private Timestamp modifiedAt;

    @Column(name = "license_start_date")
    private Date licenseStartDate;

    @Column(name = "license_end_date")
    private Date licenseEndDate;


    public enum Currency {
        EUR, USD;
    }

    public enum PaymentStatus {
        CANCELED_REVERSAL,
        COMPLETED,
        CREATED,
        DENIED,
        EXPIRED,
        FAILED,
        PENDING,
        REFUNDED,
        REVERSED,
        PROCESSED,
        VOIDED,
    }

    public enum Status {
        PENDING, ACTIVE, ARCHIVED
    }

    public PaymentDetail() {
    }

    public PaymentDetail(Integer orderId, Double amount, String description, String currency, String status,
                         String paymentId, String payerId, String paymentSource) {
        this.orderId = orderId;
        this.amount = amount;
        this.description = description;
        this.currency = currency;
        this.status = status;
        this.paymentId = paymentId;
        this.payerId = payerId;
        this.paymentSource = paymentSource;
    }
}
