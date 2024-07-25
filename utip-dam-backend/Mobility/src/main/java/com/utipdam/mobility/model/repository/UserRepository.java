package com.utipdam.mobility.model.repository;

import com.utipdam.mobility.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    Optional<User> findById(long id);
    @Modifying
    @Query(nativeQuery = true, value = "UPDATE user u SET u.active = 0, end_date = CURRENT_TIMESTAMP() WHERE u.id = :id")
    void deactivate(@Param("id") Long id);
    @Modifying
    @Query(nativeQuery = true, value = "UPDATE user u SET u.username = :username, email = :email, u.active = 0, end_date = CURRENT_TIMESTAMP() WHERE u.id = :id")
    void anonymize(@Param("id") Long id, @Param("username") String username, @Param("email") String email);
    @Modifying
    @Query(nativeQuery = true, value = "UPDATE user SET vendor_id = :vendorId WHERE id = :id")
    void updateVendor(@Param("id") Long id, @Param("vendorId") Integer vendorId);
}