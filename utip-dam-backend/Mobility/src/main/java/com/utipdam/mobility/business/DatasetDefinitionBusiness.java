package com.utipdam.mobility.business;

import com.utipdam.mobility.config.BusinessService;
import com.utipdam.mobility.exception.DefaultException;
import com.utipdam.mobility.model.DatasetDefinitionDTO;
import com.utipdam.mobility.model.entity.DatasetDefinition;
import com.utipdam.mobility.model.entity.Organization;
import com.utipdam.mobility.model.entity.Server;
import com.utipdam.mobility.model.entity.User;
import com.utipdam.mobility.model.repository.UserRepository;
import com.utipdam.mobility.model.service.DatasetDefinitionService;
import com.utipdam.mobility.model.service.OrganizationService;
import com.utipdam.mobility.model.service.ServerService;
import org.springframework.beans.factory.annotation.Autowired;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@BusinessService
public class DatasetDefinitionBusiness {
    @Autowired
    private DatasetDefinitionService datasetDefinitionService;

    @Autowired
    private OrganizationService organizationService;

    @Autowired
    private ServerService serverService;

    @Autowired
    UserRepository userRepository;
    private long DEFAULT_USER = 3; //admin
    private String DEFAULT_SERVER = "lucky";

    public List<DatasetDefinition> getAll() {
        return datasetDefinitionService.findAll();
    }

    public List<DatasetDefinition> getAllByUserId(Long userId) {
        return datasetDefinitionService.findAllByUserId(userId);
    }

    public DatasetDefinition getByName(String name) {
        return datasetDefinitionService.findByName(name);
    }

    public Optional<DatasetDefinition> getById(UUID id) {
        return datasetDefinitionService.findById(id);
    }

    public DatasetDefinition save(DatasetDefinition dataset){
        return datasetDefinitionService.save(dataset);
    }
    public DatasetDefinition save(DatasetDefinitionDTO dataset){
        UUID uuid = UUID.randomUUID();
        DatasetDefinition ds = new DatasetDefinition();
        ds.setId(uuid);
        ds.setName(dataset.getName());
        ds.setDescription(dataset.getDescription());
        ds.setCountryCode(dataset.getCountryCode());
        ds.setCity(dataset.getCity());
        ds.setFee(dataset.getFee());
        ds.setInternal(dataset.isInternal());
        ds.setPublish(dataset.isPublish());
        if (dataset.isInternal() && dataset.getServer() == null){
            Server server = serverService.findByName(DEFAULT_SERVER);
            ds.setServer(server);
        }
        if (dataset.getServer() != null){
            Server sv = serverService.findByName(dataset.getServer().getName());
            if (sv == null) {
                Server s = new Server(dataset.getServer().getName(), dataset.getServer().getDomain());
                ds.setServer(serverService.save(s));
            }else{
                ds.setServer(sv);
            }
        }
        Optional<User> userOpt;
        User user;
        if (dataset.getUserId() == null){
            userOpt = userRepository.findById(DEFAULT_USER);
        }else{
            userOpt = userRepository.findById(dataset.getUserId());
        }
        user = userOpt.get();
        ds.setUser(user);
        ds.setPublishMDS(dataset.isPublishMDS());
        ds.setPublishedOn(dataset.isPublish() ? new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime()) : null);
        ds.setFee1d(dataset.getFee1d());
        ds.setFee3mo(dataset.getFee3mo());
        ds.setFee6mo(dataset.getFee6mo());
        ds.setFee12mo(dataset.getFee12mo());
        ds.setUpdatedOn(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime()));
        if (dataset.getOrganization() != null){
            Organization response = organizationService.findByNameAndEmail(dataset.getOrganization().getName(), dataset.getOrganization().getEmail());
            if (response == null) {
                UUID orgUUID = UUID.randomUUID();
                Organization org = new Organization(orgUUID, dataset.getOrganization().getName(), dataset.getOrganization().getEmail());
                ds.setOrganization(organizationService.save(org));
            }else{
                ds.setOrganization(response);
            }
        }
        return datasetDefinitionService.save(ds);
    }

    public DatasetDefinition update(UUID id, DatasetDefinitionDTO dataset) throws DefaultException {
        if (id == null) {
            throw new DefaultException("id can not be null");
        }
        Optional<DatasetDefinition> ds = datasetDefinitionService.findById(id);
        if (ds.isPresent()){
            DatasetDefinition data = new DatasetDefinition();
            data.setId(id);
            data.setName(dataset.getName() == null ? ds.get().getName() : dataset.getName());
            data.setDescription(dataset.getDescription() == null ? ds.get().getDescription() : dataset.getDescription());
            data.setCountryCode(dataset.getCountryCode() == null ? ds.get().getCountryCode() : dataset.getCountryCode());
            data.setCity(dataset.getCity() == null ? ds.get().getCity() : dataset.getCity());
            data.setFee(dataset.getFee() == null ? ds.get().getFee() : dataset.getFee());
            if (dataset.getOrganization() == null) {
                data.setOrganization(ds.get().getOrganization());
            }else{
                Organization response = organizationService.findByNameAndEmail(dataset.getOrganization().getName(), dataset.getOrganization().getEmail());
                if (response == null) {
                    UUID orgUUID = UUID.randomUUID();
                    Organization org = new Organization(orgUUID, dataset.getOrganization().getName(), dataset.getOrganization().getEmail());
                    data.setOrganization(organizationService.save(org));
                }else{
                    data.setOrganization(response);
                }
            }
            data.setPublish(dataset.isPublish());
            data.setInternal(dataset.isInternal());
            if (dataset.isInternal() && dataset.getServer() == null){
                Server server = serverService.findByName(DEFAULT_SERVER);
                data.setServer(server);
            }
            if (dataset.getServer() != null){
                Server sv = serverService.findByName(dataset.getServer().getName());
                if (sv == null) {
                    Server s = new Server(dataset.getServer().getName(), dataset.getServer().getDomain());
                    data.setServer(serverService.save(s));
                }else{
                    data.setServer(sv);
                }
            }
            Optional<User> userOpt;
            User user;
            if (dataset.getUserId() == null){
                userOpt = userRepository.findById(DEFAULT_USER);
            }else{
                userOpt = userRepository.findById(dataset.getUserId());
            }
            if (userOpt.isPresent()){
                user = userOpt.get();
                data.setUser(user);
            }
            data.setPublishMDS(dataset.isPublishMDS());
            data.setPublishedOn(dataset.isPublish() && dataset.getPublishedOn() == null ? new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime()) : ds.get().getPublishedOn());
            data.setFee1d(dataset.getFee1d() == null ? ds.get().getFee1d() : dataset.getFee1d());
            data.setFee3mo(dataset.getFee3mo() == null ? ds.get().getFee3mo() : dataset.getFee3mo());
            data.setFee6mo(dataset.getFee6mo() == null ? ds.get().getFee6mo() : dataset.getFee6mo());
            data.setFee12mo(dataset.getFee12mo() == null ? ds.get().getFee12mo() : dataset.getFee12mo());
            data.setUpdatedOn(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime()));
            ds.get().update(data);
            return datasetDefinitionService.save(ds.get());
        }else{
            return null;
        }
    }

    public void delete(UUID id) {
        datasetDefinitionService.delete(id);
    }
}
