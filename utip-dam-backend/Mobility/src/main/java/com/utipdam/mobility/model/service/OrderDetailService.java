package com.utipdam.mobility.model.service;


import com.utipdam.mobility.model.entity.OrderDetail;
import com.utipdam.mobility.model.repository.OrderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class OrderDetailService {
    private final OrderDetailRepository orderDetailRepository;

    @Autowired
    public OrderDetailService(OrderDetailRepository orderDetailRepository) {
        this.orderDetailRepository = orderDetailRepository;
    }

    public Optional<OrderDetail> findById(Integer id) {
        return orderDetailRepository.findById(id);
    }

    public OrderDetail findByUserId(Long userId) {
        return orderDetailRepository.findByUserId(userId);
    }

    public OrderDetail findByPendingOrderByUserId(Long userId) {
        return orderDetailRepository.findByUserId(userId);
    }
    public OrderDetail save(OrderDetail orderDetail) {
        return orderDetailRepository.save(orderDetail);
    }

    public void delete(Integer id) {
        orderDetailRepository.deleteById(id);
    }
}
