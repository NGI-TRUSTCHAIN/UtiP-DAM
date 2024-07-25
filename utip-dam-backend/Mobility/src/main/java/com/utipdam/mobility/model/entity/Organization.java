package com.utipdam.mobility.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

import java.io.Serializable;
import java.util.UUID;

@Entity(name = "organization")
@Data
public class Organization implements Serializable {
    @Id
    @Column(name = "id")
    private UUID id;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;


    public Organization() {
    }

    public Organization(UUID id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }


    public void update(Organization organization) {
        if (organization.getName() != null) {
            this.name = organization.getName();
        }
        if (organization.getEmail() != null) {
            this.email = organization.getEmail();
        }
    }

}
