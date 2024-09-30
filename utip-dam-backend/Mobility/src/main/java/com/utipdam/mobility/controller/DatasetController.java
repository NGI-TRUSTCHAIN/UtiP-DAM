package com.utipdam.mobility.controller;

import com.utipdam.mobility.business.DatasetDefinitionBusiness;
import com.utipdam.mobility.business.DatasetBusiness;
import com.utipdam.mobility.business.MDSBusiness;
import com.utipdam.mobility.business.OrderBusiness;
import com.utipdam.mobility.config.AuthTokenFilter;
import com.utipdam.mobility.exception.DefaultException;
import com.utipdam.mobility.model.*;
import com.utipdam.mobility.model.entity.*;
import com.utipdam.mobility.model.repository.UserRepository;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
public class DatasetController {
    private static final Logger logger = LoggerFactory.getLogger(DatasetController.class);

    @Autowired
    private DatasetDefinitionBusiness datasetDefinitionBusiness;

    @Autowired
    private DatasetBusiness datasetBusiness;

    @Autowired
    private OrderBusiness orderBusiness;

    @Autowired
    private MDSBusiness mdsBusiness;

    @Autowired
    UserRepository userRepository;


    private final String PATH = "/data/mobility";

    @GetMapping("/v2/datasets")
    public ResponseEntity<Page<DatasetResponseDTO>> getAll(@RequestParam(required = false) Boolean publish,
                                                           @RequestParam(required = false) Boolean free,
                                                           @RequestParam(defaultValue = "0") int page,
                                                           @RequestParam(defaultValue = "9") int size) {
        Pageable paging = PageRequest.of(page, size);
        List<DatasetDefinition> pResult = datasetDefinitionBusiness.getAll();
        Stream<DatasetResponseDTO> data = pResult.stream().
                map(this::getDatasetResponseDTO);

        Page<DatasetResponseDTO> pageResult;
        List<DatasetResponseDTO> lst = getDatasetResponseList(publish, free, data);

        int start = (int) paging.getOffset();
        int end = Math.min((start + paging.getPageSize()), lst.size());

        pageResult = new PageImpl<>(lst.subList(start, end), paging, lst.size());
        return new ResponseEntity<>(pageResult, HttpStatus.OK);
    }

    @GetMapping("/datasets")
    public ResponseEntity<Map<String, Object>> getAll(@RequestParam(required = false) Boolean publish) {
        Map<String, Object> response = new HashMap<>();

        Stream<DatasetResponseDTO> data = datasetDefinitionBusiness.getAll().stream().
                map(this::getDatasetResponseDTO);

        if (publish == null) {
            response.put("data", data
                    .collect(Collectors.toList()));
        } else {
            if (publish) {
                response.put("data", data
                        .filter(dt -> checkPublish(dt.getPublish(), true))
                        .collect(Collectors.toList()));
            } else {
                response.put("data", data
                        .filter(dt -> checkPublish(dt.getPublish(), false))
                        .collect(Collectors.toList()));
            }
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/myDatasets")
    public ResponseEntity<Map<String, Object>> getAllDatasetsByUserId(@RequestParam(required = false) Boolean publish) {
        Optional<User> userOpt = userRepository.findByUsername(AuthTokenFilter.usernameLoggedIn);

        Map<String, Object> response = new HashMap<>();
        if (userOpt.isPresent()) {
            User userData = userOpt.get();
            Stream<MyDatasetsDTO> data = datasetDefinitionBusiness.getAllByUserId(userData.getId()).stream().
                    map(d -> new MyDatasetsDTO(d.getName(),
                            d.getDescription(), d.getCountryCode(), d.getCity(),
                            d.getFee(), d.getPublish(), d.getId(),
                            d.getUpdatedOn(), d.getInternal())
                    );
            List<MyDatasetsDTO> dto = checkPublishData(publish, data);
            if (dto.isEmpty()) {
                return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
            } else {
                response.put("data", dto);
                return new ResponseEntity<>(response, HttpStatus.OK);
            }

        } else {
            response.put("error", "User not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/datasetDefinition/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable UUID id,
                                                      @RequestBody DatasetDefinitionDTO dataset) {
        Optional<User> userOpt = userRepository.findByUsername(AuthTokenFilter.usernameLoggedIn);
        Map<String, Object> response = new HashMap<>();
        if (userOpt.isPresent()) {
            User userData = userOpt.get();

            DatasetDefinition d = getDatasetDefinition(id);
            if (d == null) {
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            } else {

                if (checkUser(userData, d.getUser().getId())) {
                    dataset.setUserId(d.getUser().getId());
                    DatasetDefinition dsSave = datasetDefinitionBusiness.update(id, dataset);
                    response.put("data", dsSave);
                    createAsset(dataset.isPublishMDS(), d, dsSave);
                    return new ResponseEntity<>(response, HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
                }

            }
        } else {
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/dataset/{datasetDefinitionId}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable UUID datasetDefinitionId) {
        Map<String, Object> response = new HashMap<>();
        Optional<DatasetDefinition> opt = datasetDefinitionBusiness.getById(datasetDefinitionId);
        if (opt.isPresent()) {
            DatasetDefinition d = opt.get();
            response.put("data", getDatasetResponseDTO(d));
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }

    }

    @DeleteMapping("/datasetDefinition/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        Optional<User> userOpt = userRepository.findByUsername(AuthTokenFilter.usernameLoggedIn);

        if (userOpt.isPresent()) {
            User userData = userOpt.get();
            DatasetDefinition datasetDef = getDatasetDefinition(id);
            if (datasetDef == null) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Dataset definition not found"));
            } else {
                if (checkDelete(userData, datasetDef)){
                    datasetDefinitionBusiness.delete(id);
                    return ResponseEntity.ok(new MessageResponse("Dataset definition deleted successfully!"));
                } else {
                    return ResponseEntity
                            .badRequest()
                            .body(new MessageResponse("Not authorized"));
                }
            }
        } else {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: User not found"));
        }
    }

    @DeleteMapping("/dataset/{id}")
    public ResponseEntity<?> deleteDataset(@PathVariable UUID id) {
        User userData = getUser(AuthTokenFilter.usernameLoggedIn);
        if (userData == null) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: User not found"));
        } else {
            Dataset dataset = getDataset(id);
            if (dataset == null) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Dataset not found"));
            } else {
                DatasetDefinition datasetDef = getDatasetDefinition(dataset.getDatasetDefinition().getId());
                if (datasetDef == null) {
                    return ResponseEntity
                            .badRequest()
                            .body(new MessageResponse("Error: Dataset definition not found"));
                } else {
                    if (checkDelete(userData, datasetDef, dataset)) {
                        datasetBusiness.delete(id);
                        return ResponseEntity.ok(new MessageResponse("Dataset deleted successfully!"));
                    } else {
                        return ResponseEntity
                                .badRequest()
                                .body(new MessageResponse("Not authorized"));
                    }
                }
            }
        }
    }

    @GetMapping("/datasetDefinitions")
    public ResponseEntity<Page<DatasetDefinition>> getAllDatasetDefinitions(@RequestParam(required = false) Boolean internal,
                                                                            @RequestParam(defaultValue = "0") int page,
                                                                            @RequestParam(defaultValue = "9") int size) {
        Pageable paging = PageRequest.of(page, size);
        List<DatasetDefinition> lst;
        if (internal == null) {
            lst = datasetDefinitionBusiness.getAll();
        } else {
            lst = datasetDefinitionBusiness.getAll().stream()
                    .filter(dt -> dt.getInternal() != null && (internal == dt.getInternal()))
                    .collect(Collectors.toList());
        }
        int start = (int) paging.getOffset();
        int end = Math.min((start + paging.getPageSize()), lst.size());
        Page<DatasetDefinition> pageResult;
        pageResult = new PageImpl<>(lst.subList(start, end), paging, lst.size());

        return new ResponseEntity<>(pageResult, HttpStatus.OK);
    }

    @GetMapping("/datasetDefinition/{id}")
    public ResponseEntity<Map<String, Object>> getDefinitionById(@PathVariable UUID id) {
        Map<String, Object> response = new HashMap<>();

        response.put("data", datasetDefinitionBusiness.getById(id));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    //used by admin
    @PostMapping("/datasetDefinition")
    public ResponseEntity<Map<String, Object>> save(@RequestBody DatasetDefinitionDTO dataset) {
        Map<String, Object> response = new HashMap<>();
        if (dataset.getName() == null) {
            logger.error("Name is required");
            response.put("error", "Name is required");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        DatasetDefinition ds = datasetDefinitionBusiness.getByName(dataset.getName());

        if (ds == null) {
            response.put("data", datasetDefinitionBusiness.save(dataset));
        } else {
            logger.error("Name already exists. Please choose another.");
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    //used by Internal module
    @PostMapping("/dataset")
    public ResponseEntity<Map<String, Object>> dataset(@RequestBody DatasetDTO datasetDTO) {
        Map<String, Object> response = new HashMap<>();

        Dataset d = datasetBusiness.getByDatasetDefinitionIdAndStartDate(datasetDTO.getDatasetDefinitionId(), datasetDTO.getStartDate());
        if (d == null) {
            Optional<Dataset> datasetIdCheck = datasetBusiness.getById(datasetDTO.getId());
            if (datasetIdCheck.isEmpty()) {
                Dataset dataset = getDataset(datasetDTO);
                if (dataset == null) {
                    logger.error("Dataset definition not found");
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                } else {
                    response.put("data", dataset);
                }
            } else {
                logger.error("Dataset already exists");
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }
        } else {
            logger.error("Dataset already exists");
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PutMapping("/dataset/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable UUID id,
                                                      @RequestBody DatasetDTO dataset) throws DefaultException {
        Map<String, Object> response = new HashMap<>();
        response.put("data", datasetBusiness.update(id, dataset));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private User getUser(String username){
        Optional<User> userOpt = userRepository.findByUsername(username);
        return userOpt.orElse(null);
    }

    private DatasetResponseDTO getDatasetResponseDTO(DatasetDefinition d){
        List<DatasetListDTO> dsList = datasetBusiness.getAllByDatasetDefinitionId(d.getId());
        List<DownloadsByDay> dlList = orderBusiness.getAllByDatasetDefinitionId(d.getId());

        return new DatasetResponseDTO(d.getName(),
                d.getDescription(), d.getCountryCode(), d.getCity(),
                d.getFee(), d.getPublish(),
                d.getOrganization(), d.getId(),
                d.getUpdatedOn(), getAverageDataPoints(dsList), dsList, d.getUser().getId(), d.getInternal(),
                dlList.stream().mapToInt(DownloadsByDay::getCount).sum(),
                d.getPublishMDS(), d.getPublishedOn(), d.getFee1d(), d.getFee3mo(), d.getFee6mo(), d.getFee12mo(),
                d.getUser().getVendor());
    }

    private List<DatasetResponseDTO> getDatasetResponseList(Boolean publish, Boolean free, Stream<DatasetResponseDTO> data) {
        if (publish == null) {
            return getList(free, data);
        } else {
            return getList(free, publish, data);
        }
    }

    private List<DatasetResponseDTO> getList(Boolean free, Stream<DatasetResponseDTO> data) {
        List<DatasetResponseDTO> lst;
        if (free == null) {
            lst = data.collect(Collectors.toList());
        } else {
            lst = data.filter(dt -> checkFree(free, dt.getFee()))
                    .collect(Collectors.toList());
        }
        return lst;
    }

    private List<DatasetResponseDTO> getList(Boolean free, Boolean publish, Stream<DatasetResponseDTO> data) {
        List<DatasetResponseDTO> lst;
        if (free == null) {
            lst = data.filter(dt -> checkPublish(publish,dt.getPublish()))
                    .collect(Collectors.toList());
        } else {
            lst = data.filter(dt -> checkPublish(publish, free, dt.getPublish(), dt.getFee()))
                    .collect(Collectors.toList());
        }
        return lst;
    }


    private List<MyDatasetsDTO> checkPublishData(Boolean publish, Stream<MyDatasetsDTO> data){

        if (publish != null) {
            if (publish) {
                data = data.filter(dt -> checkPublish(dt.getPublish(), true));
            } else {
                data = data.filter(dt -> checkPublish(dt.getPublish(), false));
            }
        }

        return data.collect(Collectors.toList());
    }
    private boolean checkPublish(Boolean responsePublish, boolean flag){
        if (flag){
            return responsePublish != null && responsePublish;
        }else{
            return responsePublish != null && !responsePublish;
        }
    }

    private boolean checkDelete(User userData, DatasetDefinition datasetDef, Dataset dataset){
        if (userData.getId().equals(datasetDef.getUser().getId()) ||
                userData.getRoles().stream().map(r -> r.getName().name()).toList().contains(ERole.ROLE_ADMIN.name())) {
            if (checkInternal(datasetDef.getInternal())) {
                delete(PATH + "/" + datasetDef.getId(), dataset);
            }
            return true;
        }
        return false;
    }

    private boolean checkDelete(User userData, DatasetDefinition datasetDef){
        if (userData.getId().equals(datasetDef.getUser().getId()) ||
                userData.getRoles().stream().map(r -> r.getName().name()).toList().contains(ERole.ROLE_ADMIN.name())) {
            if (datasetDef.getInternal() != null && !datasetDef.getInternal()) {
                try {
                    FileUtils.deleteDirectory(new File(PATH + "/" + datasetDef.getId()));
                } catch (IOException e) {
                    logger.error(e.getMessage());
                }
            }
            return true;
        }else {
            return false;
        }
    }

    private boolean checkInternal(Boolean internal){
        return internal != null && !internal;
    }

    private void delete(String path, Dataset dataset){
        File files =  new File(path);
        if (files.listFiles() != null) {
            for (File f : Objects.requireNonNull(files.listFiles())) {
                if (f.getName().contains(dataset.getId().toString())) {
                    f.delete();
                }
            }
        }
    }

    private boolean checkFree(Boolean free, Double fee){
        return fee != null && (free ? fee.equals(0D) : fee > 0);
    }


    private boolean checkPublish(Boolean publish, Boolean responsePublish){
        return responsePublish != null && (publish == responsePublish);
    }

    private boolean checkPublish(Boolean publish, Boolean free, Boolean responsePublish, Double fee){
        return responsePublish != null && (publish == responsePublish) &&
                checkFree(free, fee);
    }

    private long getAverageDataPoints(List<DatasetListDTO> dsList) {
        return (long) dsList.stream().filter(o -> o != null && o.getDataPoints() != null)
                .mapToLong(DatasetListDTO::getDataPoints)
                .average()
                .orElse(0L);
    }
    private Dataset getDataset(UUID id){
        Optional<Dataset> ds = datasetBusiness.getById(id);
        return ds.orElse(null);
    }

    private Dataset getDataset(DatasetDTO datasetDTO) {
        Optional<DatasetDefinition> datasetDefinition = datasetDefinitionBusiness.getById(datasetDTO.getDatasetDefinitionId());
        if (datasetDefinition.isPresent()) {
            DatasetDefinition dd = datasetDefinition.get();

            Dataset dataset = new Dataset();
            dataset.setId(datasetDTO.getId());
            dataset.setDatasetDefinition(dd);
            dataset.setStartDate(datasetDTO.getStartDate());
            dataset.setEndDate(datasetDTO.getEndDate());
            dataset.setResolution(datasetDTO.getResolution());
            dataset.setK(datasetDTO.getK());
            dataset.setDataPoints(datasetDTO.getDataPoints());

            Dataset dsSave = datasetBusiness.save(dataset);
            if (dsSave != null) {
                dd.setUpdatedOn(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime()));
                dd.update(dd);
                datasetDefinitionBusiness.save(dd);
            }
            return dsSave;
        }
        return null;
    }


    private boolean checkUser(User userData, Long userId){
        return userData.getId().equals(userId);
    }

    private void createAsset(Boolean publishMDS, DatasetDefinition d, DatasetDefinition dsSave){
        Boolean mdsOrigVal = d.getPublishMDS();
        if (publishMDS && !mdsOrigVal) {
            String accessToken = mdsBusiness.getAuthenticationToken();
            logger.info(accessToken);
            if (accessToken != null) {
                mdsBusiness.createAsset(dsSave, accessToken);
            }
        }
    }

    private DatasetDefinition getDatasetDefinition(UUID id) {
        Optional<DatasetDefinition> opt = datasetDefinitionBusiness.getById(id);
        return opt.orElse(null);
    }


}