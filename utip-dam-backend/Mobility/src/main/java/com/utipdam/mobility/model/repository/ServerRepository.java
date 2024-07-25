package com.utipdam.mobility.model.repository;

import com.utipdam.mobility.model.entity.Server;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ServerRepository extends JpaRepository<Server, Integer> {
    List<Server> findAll();
    Optional<Server> findById(@Param("id") Integer id);
    Server findByName(@Param("name") String name);
}
