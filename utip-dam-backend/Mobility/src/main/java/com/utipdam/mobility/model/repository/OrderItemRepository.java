package com.utipdam.mobility.model.repository;

import com.utipdam.mobility.model.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    List<OrderItem> findAll();
    Optional<OrderItem> findById(@Param("id") Integer id);
    List<OrderItem> findAllByOrderId(@Param("orderId") Integer orderId);
    @Query(nativeQuery = true, value = "SELECT i.* FROM order_item i INNER JOIN order_detail o ON i.order_id = o.id WHERE o.user_id = :userId")
    List<OrderItem> findAllByUserId(@Param("userId") Long userId);

    @Query(nativeQuery = true, value = "SELECT i.* FROM order_item i INNER JOIN dataset_activation d ON " +
            "i.id = d.order_item_id INNER JOIN payment_detail p ON p.id = d.payment_detail_id WHERE d.user_id = :userId and "+
            " (p.status = 'PENDING' or ((p.status = 'COMPLETED' or p.status = 'LICENSE_ONLY') and d.active = 1 or DATE_ADD(d.expiration_date, INTERVAL 1 DAY) > CURDATE())) order by id DESC")
    List<OrderItem> findAllByUserIdAndIsActive(@Param("userId") Long userId);

}
