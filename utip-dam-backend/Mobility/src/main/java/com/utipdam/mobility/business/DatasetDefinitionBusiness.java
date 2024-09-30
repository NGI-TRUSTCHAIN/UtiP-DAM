package com.utipdam.mobility.business;

import com.utipdam.mobility.config.BusinessService;
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
import java.util.*;

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

        if (dataset.getServer() != null){
            ds.setServer(getServer(dataset.getServer().getName(), dataset.getServer().getDomain()));
        }
        ds.setUser(getUser(dataset.getUserId()));
        ds.setPublishMDS(dataset.isPublishMDS());
        ds.setPublishedOn(dataset.isPublish() ? new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime()) : null);
        ds.setFee1d(dataset.getFee1d());
        ds.setFee3mo(dataset.getFee3mo());
        ds.setFee6mo(dataset.getFee6mo());
        ds.setFee12mo(dataset.getFee12mo());
        ds.setUpdatedOn(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime()));
        if (dataset.getOrganization() != null) {
            ds.setOrganization(getOrganization(dataset.getOrganization().getName(),
                    dataset.getOrganization().getEmail()));
        }
        return datasetDefinitionService.save(ds);
    }

    public DatasetDefinition update(UUID id, DatasetDefinitionDTO dataset) {
        Optional<DatasetDefinition> ds = datasetDefinitionService.findById(id);
        if (ds.isPresent()){
            DatasetDefinition data = new DatasetDefinition();
            data.setId(id);
            data.setName(checkEmpty(dataset.getName(), ds.get().getName()));
            data.setDescription(checkEmpty(dataset.getDescription(),ds.get().getDescription()));
            data.setCountryCode(checkEmpty(dataset.getCountryCode(), ds.get().getCountryCode()));
            data.setCity(checkEmpty(dataset.getCity(), ds.get().getCity()));
            data.setFee(checkEmpty(dataset.getFee(), ds.get().getFee()));
            if (dataset.getOrganization() == null) {
                data.setOrganization(ds.get().getOrganization());
            }else{
                data.setOrganization(getOrganization(dataset.getOrganization().getName(),
                        dataset.getOrganization().getEmail()));
            }

            data.setPublish(dataset.isPublish());
            if (ds.get().getInternal()){
                data.setInternal(true);
                data.setServer(ds.get().getServer());
            }else{
                data.setInternal(dataset.isInternal());
                if (dataset.getServer() != null){
                    data.setServer(getServer(dataset.getServer().getName(), dataset.getServer().getDomain()));
                }
            }

            data.setUser(getUser(dataset.getUserId()));
            data.setPublishMDS(dataset.isPublishMDS());
            data.setPublishedOn(checkPublish(dataset.isPublish(), dataset.getPublishedOn(), ds.get().getPublishedOn()));
            data.setFee1d(checkEmpty(dataset.getFee1d(),ds.get().getFee1d()));
            data.setFee3mo(checkEmpty(dataset.getFee3mo(), ds.get().getFee3mo()));
            data.setFee6mo(checkEmpty(dataset.getFee6mo(), ds.get().getFee6mo()));
            data.setFee12mo(checkEmpty(dataset.getFee12mo(), ds.get().getFee12mo()));
            data.setUpdatedOn(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime()));
            ds.get().update(data);
            return datasetDefinitionService.save(ds.get());
        }

        return null;
    }

    public void delete(UUID id) {
        datasetDefinitionService.delete(id);
    }

    private String checkEmpty(String text, String defaultVal){
        return text == null ? defaultVal: text;
    }

    private Double checkEmpty(Double text, Double defaultVal){
        return text == null ? defaultVal: text;
    }


    private String checkPublish(Boolean isPublish, String text, String defaultVal){
        return isPublish && text == null ? new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime()) : defaultVal;
    }


    private Organization getOrganization(String name, String email){
        Organization response = organizationService.findByNameAndEmail(name, email);
        if (response == null) {
            UUID orgUUID = UUID.randomUUID();
            return organizationService.save(new Organization(orgUUID, name, email));
        }else {
            return response;
        }
    }

    private Server getServer(String name, String domain){
        Server sv = serverService.findByName(name);
        return Objects.requireNonNullElseGet(sv, () -> serverService.save(new Server(name, domain)));
    }

    private User getUser(long id){
        Optional<User> userOpt = userRepository.findById(id);
        return userOpt.orElse(null);
    }

}
