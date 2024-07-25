package com.utipdam.mobility.business;

import com.utipdam.mobility.config.BusinessService;
import com.utipdam.mobility.exception.DefaultException;
import com.utipdam.mobility.model.entity.Organization;
import com.utipdam.mobility.model.entity.Server;
import com.utipdam.mobility.model.service.ServerService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;


@BusinessService
public class ServerBusiness {
    @Autowired
    private ServerService serverService;

    public List<Server> getAll() {
        return serverService.findAll();
    }

    public Server getByName(String name) {
        return serverService.findByName(name);
    }


    public Optional<Server> getById(Integer id) {
        return serverService.findById(id);
    }

    public Server save(Server server){
        return serverService.save(server);
    }

    public Server update(Integer id, Server server) throws DefaultException {
        if (id == null) {
            throw new DefaultException("id can not be null");
        }
        Optional<Server> s = serverService.findById(id);
        if (s.isPresent()){
            s.get().update(server);
            return serverService.save(s.get());
        }else{
            return null;
        }
    }

    public void delete(Integer id) {
        serverService.delete(id);
    }

}
