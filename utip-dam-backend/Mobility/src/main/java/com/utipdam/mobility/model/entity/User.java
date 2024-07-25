package com.utipdam.mobility.model.entity;

import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Data
@Table(name = "user",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "email")
        })
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(max = 120)
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(  name = "user_role",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    @Column(name = "active")
    private Boolean active;

    @Column(name = "end_date")
    private Timestamp endDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;

    public User() {
    }

    public User(String username, String email, String password, Boolean active, Timestamp endDate) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.active = active;
        this.endDate = endDate;
    }

    public User(Long id, String username, String email, String password, Boolean active, Timestamp endDate) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.active = active;
        this.endDate = endDate;
    }


    // getters and setters
}