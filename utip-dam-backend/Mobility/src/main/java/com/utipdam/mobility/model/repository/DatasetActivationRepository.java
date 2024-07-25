package com.utipdam.mobility.model.repository;

import com.utipdam.mobility.model.entity.DatasetActivation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DatasetActivationRepository extends JpaRepository<DatasetActivation, Integer> {
    List<DatasetActivation> findAll();
    Optional<DatasetActivation> findByPaymentDetailId(@Param("paymentDetailId") Integer paymentDetailId);
    Optional<DatasetActivation> findByApiKey(@Param("apiKey") UUID apiKey);
}