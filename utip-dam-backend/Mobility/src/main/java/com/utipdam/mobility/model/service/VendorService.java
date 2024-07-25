package com.utipdam.mobility.model.service;


import com.utipdam.mobility.model.entity.Vendor;
import com.utipdam.mobility.model.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class VendorService {
    private final VendorRepository vendorRepository;

    @Autowired
    public VendorService(VendorRepository vendorRepository) {
        this.vendorRepository = vendorRepository;
    }

    public Vendor findByUserId(Long userId) {
        return vendorRepository.findByUserId(userId);
    }

    public Optional<Vendor> findById(Integer id) {
        return vendorRepository.findById(id);
    }

    public List<Vendor> findAll() {
        return vendorRepository.findAll();
    }

    public Vendor save(Vendor vendor) {
        return vendorRepository.save(vendor);
    }

    public void delete(Integer id) {
        vendorRepository.deleteById(id);
    }
}
