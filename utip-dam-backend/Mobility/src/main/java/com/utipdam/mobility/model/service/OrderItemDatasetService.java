package com.utipdam.mobility.model.service;


import com.utipdam.mobility.model.entity.OrderItemDataset;
import com.utipdam.mobility.model.repository.OrderItemDatasetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class OrderItemDatasetService {
    private final OrderItemDatasetRepository orderItemDatasetRepository;

    @Autowired
    public OrderItemDatasetService(OrderItemDatasetRepository orderItemDatasetRepository) {
        this.orderItemDatasetRepository = orderItemDatasetRepository;
    }
    public List<OrderItemDataset> findAllSelectedDateByUserIdAndIsActive(Long userId) {
        return orderItemDatasetRepository.findAllSelectedDateByUserIdAndIsActive(userId);
    }
    public Optional<OrderItemDataset> findById(Integer id) {
        return orderItemDatasetRepository.findById(id);
    }

    public List<OrderItemDataset> findAllByOrderItemId(Integer orderItemId) {
        return orderItemDatasetRepository.findAllByOrderItemId(orderItemId);
    }

    public OrderItemDataset save(OrderItemDataset orderItemDataset) {
        return orderItemDatasetRepository.save(orderItemDataset);
    }

    public void delete(Integer id) {
        orderItemDatasetRepository.deleteById(id);
    }
}
