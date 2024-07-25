package com.utipdam.mobility.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Entity(name = "server")
@Data
public class Server implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "domain")
    private String domain;


    public Server() {
    }

    public Server(String name, String domain) {
        this.name = name;
        this.domain = domain;
    }


    public void update(Server server) {
        if (server.getName() != null) {
            this.name = server.getName();
        }
        if (server.getDomain() != null) {
            this.domain = server.getDomain();
        }
    }

}
