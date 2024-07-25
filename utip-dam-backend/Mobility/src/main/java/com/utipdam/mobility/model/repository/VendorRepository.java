package com.utipdam.mobility.model.repository;

import com.utipdam.mobility.model.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Integer> {
    List<Vendor> findAll();
    Vendor findByAccountNo(@Param("accountNo") String accountNo);
    Vendor findByAccountName(@Param("accountName") String accountName);
    @Query(nativeQuery = true, value = "SELECT v.* FROM vendor v INNER JOIN user u ON u.vendor_id = v.id WHERE u.id = :userId")
    Vendor findByUserId(@Param("userId") Long userId);
}