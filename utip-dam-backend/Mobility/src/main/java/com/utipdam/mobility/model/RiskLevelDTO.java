package com.utipdam.mobility.model;


import com.utipdam.mobility.model.entity.RiskLevel;
import lombok.Data;

@Data
public class RiskLevelDTO {
    private Integer id;
    private String name;

    public RiskLevelDTO(RiskLevel riskLevel) {
        this.id = riskLevel.getId();
        this.name = riskLevel.getName();
    }
}