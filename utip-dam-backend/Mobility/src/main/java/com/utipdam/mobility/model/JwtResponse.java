package com.utipdam.mobility.model;

import lombok.Data;

import java.util.List;

@Data
public class JwtResponse {
    private String token;
    private String type;
    private Long id;
    private String username;
    private String email;
    private List<String> roles;

    public JwtResponse(String token,  Long id,
                       String username, String email, List<String> roles) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
    }
}