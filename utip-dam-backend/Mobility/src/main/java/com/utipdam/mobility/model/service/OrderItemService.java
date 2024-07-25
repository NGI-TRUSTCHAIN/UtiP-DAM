package com.utipdam.mobility.model.service;


import com.utipdam.mobility.model.entity.OrderItem;
import com.utipdam.mobility.model.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class OrderItemService {
    private final OrderItemRepository orderItemRepository;

    @Autowired
    public OrderItemService(OrderItemRepository orderItemRepository) {
        this.orderItemRepository = orderItemRepository;
    }

    public Optional<OrderItem> findById(Integer id) {
        return orderItemRepository.findById(id);
    }

    public List<OrderItem> findAllByOrderId(Integer orderId) {
        return orderItemRepository.findAllByOrderId(orderId);
    }

    public List<OrderItem> findAllByUserIdAndIsActive(Long userId) {
        return orderItemRepository.findAllByUserIdAndIsActive(userId);
    }

    public OrderItem save(OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    public void delete(Integer id) {
        orderItemRepository.deleteById(id);
    }
}
