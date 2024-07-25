package com.utipdam.mobility.model.service;


import com.utipdam.mobility.model.entity.DatasetActivation;
import com.utipdam.mobility.model.repository.DatasetActivationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;


@Service
public class DatasetActivationService {
    private final DatasetActivationRepository datasetActivationRepository;

    @Autowired
    public DatasetActivationService(DatasetActivationRepository datasetActivationRepository) {
        this.datasetActivationRepository = datasetActivationRepository;
    }

    public Optional<DatasetActivation> findByPaymentDetailId(Integer id) {
        return datasetActivationRepository.findByPaymentDetailId(id);
    }

    public DatasetActivation save(DatasetActivation datasetActivation) {
        return datasetActivationRepository.save(datasetActivation);
    }

    public Optional<DatasetActivation> validateApiKey(UUID requestApiKey) {
        return datasetActivationRepository.findByApiKey(requestApiKey);
    }

    public void delete(Integer id) {
        datasetActivationRepository.deleteById(id);
    }
}
