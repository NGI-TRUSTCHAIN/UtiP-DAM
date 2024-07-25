package com.utipdam.mobility.model.service;


import com.utipdam.mobility.model.entity.Server;
import com.utipdam.mobility.model.repository.ServerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class ServerService {
    private final ServerRepository serverRepository;

    @Autowired
    public ServerService(ServerRepository serverRepository) {
        this.serverRepository = serverRepository;
    }

    public Server findByName(String name) {
        return serverRepository.findByName(name);
    }

    public Optional<Server> findById(Integer id) {
        return serverRepository.findById(id);
    }

    public List<Server> findAll() {
        return serverRepository.findAll();
    }

    public Server save(Server server) {
        return serverRepository.save(server);
    }

    public void delete(Integer id) {
        serverRepository.deleteById(id);
    }
}
