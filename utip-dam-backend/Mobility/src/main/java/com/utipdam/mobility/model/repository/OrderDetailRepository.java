package com.utipdam.mobility.model.repository;

import com.utipdam.mobility.model.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    List<OrderDetail> findAll();
    Optional<OrderDetail> findById(@Param("id") Integer id);
    OrderDetail findByUserId(@Param("userId") Long userId);

}
