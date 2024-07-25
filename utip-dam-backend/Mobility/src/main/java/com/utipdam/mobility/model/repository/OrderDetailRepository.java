package com.utipdam.mobility.model.repository;

import com.utipdam.mobility.model.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    List<OrderDetail> findAll();
    Optional<OrderDetail> findById(@Param("id") Integer id);

    OrderDetail findByUserId(@Param("userId") Long userId);

//    @Query(nativeQuery = true, value = "SELECT p.* FROM payment_detail p INNER JOIN order_detail o ON p.order_id = o.id WHERE o.user_id = :userId")
//    OrderDetail findPendingOrderByUserId(@Param("userId") Long userId);

}
