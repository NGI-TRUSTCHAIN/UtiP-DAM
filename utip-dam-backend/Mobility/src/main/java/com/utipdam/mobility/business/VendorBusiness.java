package com.utipdam.mobility.business;

import com.utipdam.mobility.config.BusinessService;
import com.utipdam.mobility.model.entity.Vendor;
import com.utipdam.mobility.model.service.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;


@BusinessService
public class VendorBusiness {

    @Autowired
    private VendorService vendorService;

    public List<Vendor> getAll() {
        return vendorService.findAll();
    }


    public Vendor getByUserId(Long userId) {
        return vendorService.findByUserId(userId);
    }

    public Optional<Vendor> getById(Integer id) {
        return vendorService.findById(id);
    }

    public Vendor save(Vendor vendor){
        return vendorService.save(vendor);
    }

    public Vendor update(Integer id, Vendor vendor) {

        Optional<Vendor> s = vendorService.findById(id);
        if (s.isPresent()){
            s.get().update(vendor);
            return vendorService.save(s.get());
        }else{
            return null;
        }
    }

    public void delete(Integer id) {
        vendorService.delete(id);
    }

}
