package com.utipdam.mobility.controller;

import com.utipdam.mobility.business.OrganizationBusiness;
import com.utipdam.mobility.exception.DefaultException;
import com.utipdam.mobility.model.entity.Organization;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
public class OrganizationController {
    private static final Logger logger = LoggerFactory.getLogger(OrganizationController.class);

    @Autowired
    private OrganizationBusiness organizationBusiness;

    @GetMapping("/organizations")
    public ResponseEntity<Map<String, Object>> getAllOrganizations(@RequestParam(required = false) String name) {
        Map<String, Object> response = new HashMap<>();
        if (name == null){
            response.put("data", organizationBusiness.getAll());
        }else{
            response.put("data", organizationBusiness.getByName(name));
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/organization/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable UUID id) {
        Map<String, Object> response = new HashMap<>();

        response.put("data", organizationBusiness.getById(id));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/organization")
    public ResponseEntity<Map<String, Object>> save(@RequestBody Organization organization) {
        Map<String, Object> response = new HashMap<>();
        if (organization.getName() == null) {
            logger.error("Name is required");
            response.put("error", "Name is required");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        if (organization.getEmail() == null) {
            logger.error("Email is required");
            response.put("error", "Email is required");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }


        Organization org = organizationBusiness.getByNameAndEmail(organization.getName(), organization.getEmail());

        if (org == null) {
            response.put("data", organizationBusiness.save(organization));
        } else {
            logger.error("Name already exists. Please choose another.");
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/organization/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable UUID id,
                                                      @RequestBody Organization organization) throws DefaultException {
        Map<String, Object> response = new HashMap<>();
        response.put("data", organizationBusiness.update(id, organization));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/organization/{id}")
    public void delete(@PathVariable UUID id) {
        organizationBusiness.delete(id);
    }

}