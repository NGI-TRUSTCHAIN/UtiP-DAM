package com.utipdam.mobility.business;

import com.utipdam.mobility.config.BusinessService;
import com.utipdam.mobility.exception.DefaultException;
import com.utipdam.mobility.model.entity.Organization;
import com.utipdam.mobility.model.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@BusinessService
public class OrganizationBusiness {
    @Autowired
    private OrganizationService organizationService;

    public List<Organization> getAll() {
        return organizationService.findAll();
    }

    public Organization getByName(String name) {
        return organizationService.findByName(name);
    }

    public Organization getByNameAndEmail(String name, String email) {
        return organizationService.findByNameAndEmail(name, email);
    }

    public Optional<Organization> getById(UUID id) {
        return organizationService.findById(id);
    }

    public Organization save(Organization organization){
        UUID uuid = UUID.randomUUID();
        organization.setId(uuid);
        return organizationService.save(organization);
    }

    public Organization update(UUID id, Organization organization) throws DefaultException {
        if (id == null) {
            throw new DefaultException("id can not be null");
        }
        Optional<Organization> ds = organizationService.findById(id);
        if (ds.isPresent()){
            ds.get().update(organization);
            return organizationService.save(ds.get());
        }else{
            return null;
        }
    }

    public void delete(UUID id) {
        organizationService.delete(id);
    }
}
