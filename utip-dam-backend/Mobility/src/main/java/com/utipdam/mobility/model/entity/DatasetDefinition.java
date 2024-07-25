package com.utipdam.mobility.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.UUID;

@Entity(name = "dataset_definition")
@Data
public class DatasetDefinition implements Serializable {
    @Id
    @Column(name = "id")
    private UUID id;

    @Column(name = "name")
    private String name;

    @Column(name = "country_code")
    private String countryCode;

    @Column(name = "city")
    private String city;

    @Column(name = "description")
    private String description;

    @Column(name = "fee")
    private Double fee;

    @Column(name = "updated_on")
    private String updatedOn = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime());

    @Column(name = "publish")
    private Boolean publish;

    @Column(name = "internal")
    private Boolean internal;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "server_id")
    private Server server;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "publish_mds")
    private Boolean publishMDS;

    @Column(name = "published_on")
    private String publishedOn = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime());

    @Column(name = "fee_1d")
    private Double fee1d;

    @Column(name = "fee_3mo")
    private Double fee3mo;

    @Column(name = "fee_6mo")
    private Double fee6mo;

    @Column(name = "fee_12mo")
    private Double fee12mo;

    public DatasetDefinition() {
    }

    public void update(DatasetDefinition datasetDefinition) {
        if (datasetDefinition.getName() != null) {
            this.name = datasetDefinition.getName();
        }
        if (datasetDefinition.getDescription() != null) {
            this.description = datasetDefinition.getDescription();
        }
        if (datasetDefinition.getFee() != null) {
            this.fee = datasetDefinition.getFee();
        }
        if (datasetDefinition.getOrganization() != null) {
            this.organization = datasetDefinition.getOrganization();
        }
        if (datasetDefinition.getCountryCode() != null) {
            this.countryCode = datasetDefinition.getCountryCode();
        }
        if (datasetDefinition.getCity() != null) {
            this.city = datasetDefinition.getCity();
        }
        if (datasetDefinition.getPublish() != null) {
            this.publish = datasetDefinition.getPublish();
        }
        if (datasetDefinition.getInternal() != null) {
            this.internal = datasetDefinition.getInternal();
        }
        if (datasetDefinition.getServer() != null) {
            this.server = datasetDefinition.getServer();
        }
        if (datasetDefinition.getUser() != null) {
            this.user = datasetDefinition.getUser();
        }
        if (datasetDefinition.getPublishMDS() != null) {
            this.publishMDS = datasetDefinition.getPublishMDS();
        }
        if (datasetDefinition.getFee1d() != null) {
            this.fee1d = datasetDefinition.getFee1d();
        }
        if (datasetDefinition.getFee3mo() != null) {
            this.fee3mo = datasetDefinition.getFee3mo();
        }
        if (datasetDefinition.getFee6mo() != null) {
            this.fee6mo = datasetDefinition.getFee6mo();
        }
        if (datasetDefinition.getFee12mo() != null) {
            this.fee12mo = datasetDefinition.getFee12mo();
        }
        if (datasetDefinition.getPublishedOn() != null) {
            this.publishedOn = datasetDefinition.getPublishedOn();
        }

        this.updatedOn = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime());
    }
}
