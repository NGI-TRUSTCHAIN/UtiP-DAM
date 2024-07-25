package com.utipdam.mobility.controller;

import com.utipdam.mobility.SendEmail;
import com.utipdam.mobility.model.Email;
import org.apache.commons.validator.routines.EmailValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class EmailController {
    private static final Logger logger = LoggerFactory.getLogger(EmailController.class);

    @Autowired
    private SendEmail sendEmail;

    @PostMapping("/email/send")
    public ResponseEntity<Map<String, Object>> contactUs(@RequestBody Email email) {
        Map<String, Object> response = new HashMap<>();
        if (email.getName() == null || email.getName().trim().isEmpty()) {
            logger.error("Name is required");
            response.put("error", "Name is required");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        if (email.getContactEmail() == null || email.getContactEmail().trim().isEmpty()) {
            logger.error("Email is required");
            response.put("error", "Email is required");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }else{
            EmailValidator emailvalidator = EmailValidator.getInstance();
            if(!emailvalidator.isValid(email.getContactEmail())){
                logger.error("Email is invalid");
                response.put("error", "Invalid email format");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
        }
        if (email.getMessage() == null || email.getMessage().trim().isEmpty()) {
            logger.error("Message is required");
            response.put("error", "Message is required");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        String responseMsg = sendEmail.send(email);
        if (responseMsg.contains("Success")){
            response.put("status", responseMsg);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            response.put("error", responseMsg);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
