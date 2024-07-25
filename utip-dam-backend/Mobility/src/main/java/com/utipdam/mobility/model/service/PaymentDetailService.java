package com.utipdam.mobility.model.service;


import com.utipdam.mobility.model.entity.PaymentDetail;
import com.utipdam.mobility.model.repository.PaymentDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class PaymentDetailService {
    private final PaymentDetailRepository paymentDetailRepository;

    @Autowired
    public PaymentDetailService(PaymentDetailRepository paymentDetailRepository) {
        this.paymentDetailRepository = paymentDetailRepository;
    }

    public Optional<PaymentDetail> findById(Integer id) {
        return paymentDetailRepository.findById(id);
    }
    public List<PaymentDetail> findAllByUserId(Long userId) {
        return paymentDetailRepository.findAllByUserId(userId);
    }

    public List<PaymentDetail> findAllByDatasetOwnerIdAndIsActive(Long datasetOwnerId, Boolean active) {
        return paymentDetailRepository.findAllByDatasetOwnerIdAndIsActive(datasetOwnerId, active);
    }
    public List<PaymentDetail> findAllByDatasetOwnerIdAndPaymentSource(Long datasetOwnerId, String paymentSource) {
        return paymentDetailRepository.findAllByDatasetOwnerIdAndPaymentSource(datasetOwnerId, paymentSource);
    }
    public PaymentDetail save(PaymentDetail paymentDetail) {
        return paymentDetailRepository.save(paymentDetail);
    }

    public void delete(Integer id) {
        paymentDetailRepository.deleteById(id);
    }
}
