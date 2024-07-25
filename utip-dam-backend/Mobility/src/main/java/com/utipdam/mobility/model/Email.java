package com.utipdam.mobility.model;

import lombok.Data;

@Data
public class Email {
    private String name;
    private String contactEmail;
    private String recipientEmail;
    private String subject;
    private String message;
}