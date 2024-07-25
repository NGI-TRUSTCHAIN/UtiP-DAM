package com.utipdam.mobility.model;

import lombok.Data;

@Data
public class PaymentDTO {
    private Integer orderId;
    private String description;

    public PaymentDTO() {
    }

}
