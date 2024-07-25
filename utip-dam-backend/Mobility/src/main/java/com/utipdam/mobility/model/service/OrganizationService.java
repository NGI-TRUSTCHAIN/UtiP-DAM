package com.utipdam.mobility.model.service;


import com.utipdam.mobility.model.entity.Organization;
import com.utipdam.mobility.model.repository.OrganizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrganizationService {
    private final OrganizationRepository organizationRepository;

    @Autowired
    public OrganizationService(OrganizationRepository organizationRepository) {
        this.organizationRepository = organizationRepository;
    }

    public Organization findByNameAndEmail(String name, String email) {
        return organizationRepository.findByNameAndEmail(name, email);
    }
    public Organization findByName(String name) {
        return organizationRepository.findByName(name);
    }

    public Optional<Organization> findById(UUID id) {
        return organizationRepository.findById(id);
    }

    public List<Organization> findAll() {
        return organizationRepository.findAll();
    }

    public Organization save(Organization organization) {
        return organizationRepository.save(organization);
    }

    public void delete(UUID id) {
        organizationRepository.deleteById(id);
    }
}
