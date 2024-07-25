package com.utipdam.mobility.model.repository;

import com.utipdam.mobility.model.entity.OrderItemDataset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderItemDatasetRepository extends JpaRepository<OrderItemDataset, Integer> {
    List<OrderItemDataset> findAll();
    Optional<OrderItemDataset> findById(@Param("id") Integer id);
    List<OrderItemDataset> findAllByOrderItemId(@Param("orderItemId") Integer orderItemId);
    @Query(nativeQuery = true, value = "SELECT o.* FROM order_item_dataset o INNER JOIN dataset_activation d ON " +
            "o.order_item_id = d.order_item_id INNER JOIN payment_detail p ON p.id = d.payment_detail_id WHERE d.user_id = :userId and "+
            " (p.status = 'PENDING' or ((p.status = 'COMPLETED' or p.status = 'LICENSE_ONLY') and d.active = 1 and DATE_ADD(d.expiration_date, INTERVAL 1 DAY) >= CURDATE())) order by id DESC")
    List<OrderItemDataset> findAllSelectedDateByUserIdAndIsActive(@Param("userId") Long userId);
}
