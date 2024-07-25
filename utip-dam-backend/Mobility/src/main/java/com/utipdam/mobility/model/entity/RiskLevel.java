package com.utipdam.mobility.model.entity;


public enum RiskLevel {

    no_match(0, "no match"),
    no_risk(1, "no risk"),
    low(2, "low"),
    high(3, "high");

    private final Integer id;
    private final String name;


    RiskLevel(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public static RiskLevel find(Integer id) {
        for (RiskLevel me : RiskLevel.values()) {
            if (me.getId().equals(id))
                return me;
        }
        return null;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }


}
