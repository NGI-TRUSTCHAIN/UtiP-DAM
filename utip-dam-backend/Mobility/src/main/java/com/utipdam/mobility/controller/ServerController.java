package com.utipdam.mobility.controller;

import com.utipdam.mobility.business.ServerBusiness;
import com.utipdam.mobility.exception.DefaultException;
import com.utipdam.mobility.model.entity.Server;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class ServerController {
    private static final Logger logger = LoggerFactory.getLogger(ServerController.class);

    @Autowired
    private ServerBusiness serverBusiness;

    @GetMapping("/servers")
    public ResponseEntity<Map<String, Object>> getAll(@RequestParam(required = false) String name) {
        Map<String, Object> response = new HashMap<>();
        if (name == null){
            response.put("data", serverBusiness.getAll());
        }else{
            response.put("data", serverBusiness.getByName(name));
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/server/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();

        response.put("data", serverBusiness.getById(id));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/server")
    public ResponseEntity<Map<String, Object>> save(@RequestBody Server server) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> error = validate(server);
        if (error != null){
            return error;
        }

        Server sv = serverBusiness.getByName(server.getName());

        if (sv == null) {
            response.put("data", serverBusiness.save(server));
        } else {
            logger.error("Name already exists. Please choose another.");
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private ResponseEntity<Map<String, Object>> validate(Server server){
        Map<String, Object> response = new HashMap<>();
        if (server.getName() == null) {
            logger.error("Name is required");
            response.put("error", "Name is required");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        if (server.getDomain() == null) {
            logger.error("Domain is required");
            response.put("error", "Domain is required");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        return null;
    }

    @PutMapping("/server/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Integer id,
                                                      @RequestBody Server server) throws DefaultException {
        Map<String, Object> response = new HashMap<>();
        response.put("data", serverBusiness.update(id, server));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


}