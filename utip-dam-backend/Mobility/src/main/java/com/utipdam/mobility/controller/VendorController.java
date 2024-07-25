package com.utipdam.mobility.controller;

import com.utipdam.mobility.business.VendorBusiness;
import com.utipdam.mobility.config.AuthTokenFilter;
import com.utipdam.mobility.model.entity.User;
import com.utipdam.mobility.model.entity.Vendor;
import com.utipdam.mobility.model.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
public class VendorController {
    private static final Logger logger = LoggerFactory.getLogger(VendorController.class);

    @Autowired
    private VendorBusiness vendorBusiness;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/vendors")
    public ResponseEntity<Map<String, Object>> getAll() {
        Map<String, Object> response = new HashMap<>();
        response.put("data", vendorBusiness.getAll());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/vendor")
    public ResponseEntity<Map<String, Object>> getById() {
        Optional<User> userOpt = userRepository.findByUsername(AuthTokenFilter.usernameLoggedIn);

        Map<String, Object> response = new HashMap<>();
        if (userOpt.isPresent()) {
            User userData = userOpt.get();
            Vendor v = vendorBusiness.getByUserId(userData.getId());
            if (v == null) {
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }else{
                response.put("data", v);
                return new ResponseEntity<>(response, HttpStatus.OK);
            }

        } else {
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }

    }

    @PostMapping("/vendor")
    @Transactional
    public ResponseEntity<Map<String, Object>> save(@RequestBody Vendor vendor) {
        Map<String, Object> response = new HashMap<>();
        if (vendor.getAccountNo() == null) {
            logger.error("Account no. is required");
            response.put("error", "Account no. is required");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        if (vendor.getAccountName() == null) {
            logger.error("Account name is required");
            response.put("error", "Account name is required");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        if (vendor.getBankName() == null) {
            logger.error("Bank name is required");
            response.put("error", "Bank name is required");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        Optional<User> userOpt = userRepository.findByUsername(AuthTokenFilter.usernameLoggedIn);
        if (userOpt.isPresent()){
            User user = userOpt.get();
            if (user.getVendor() == null) {
                Vendor vendorSave = vendorBusiness.save(vendor);
                userRepository.updateVendor(user.getId(), vendorSave.getId());
                response.put("data", vendorSave);
            } else {
                logger.error("Vendor already exists");
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }else{
            response.put("error", "User not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/vendor")
    public ResponseEntity<Map<String, Object>> update(@RequestBody Vendor vendor) {
        Optional<User> userOpt = userRepository.findByUsername(AuthTokenFilter.usernameLoggedIn);

        Map<String, Object> response = new HashMap<>();

        if (userOpt.isPresent()) {
            User userData = userOpt.get();
            Vendor v = vendorBusiness.getByUserId(userData.getId());
            if (v == null) {
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }else{
                Vendor vUpdate = vendorBusiness.update(v.getId(), vendor);
                if (vUpdate == null){
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }else{
                    response.put("data", vUpdate);
                    return new ResponseEntity<>(response, HttpStatus.OK);
                }
            }
        } else {
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }
}