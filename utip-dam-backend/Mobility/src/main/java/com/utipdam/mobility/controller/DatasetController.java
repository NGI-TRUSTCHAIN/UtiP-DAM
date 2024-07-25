package com.utipdam.mobility.controller;

import com.utipdam.mobility.business.DatasetDefinitionBusiness;
import com.utipdam.mobility.business.DatasetBusiness;
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
                map(d -> {
                    List<DatasetListDTO> dsList = datasetBusiness.getAllByDatasetDefinitionId(d.getId());
                    List<DownloadsByDay> dlList = orderBusiness.getAllByDatasetDefinitionId(d.getId());

                    return new DatasetResponseDTO(d.getName(),
                            d.getDescription(), d.getCountryCode(), d.getCity(),
                            d.getFee(), d.getPublish(),
                            d.getOrganization(), d.getId(),
                            d.getUpdatedOn(), (long) dsList.stream().filter(o -> o != null && o.getDataPoints() != null)
                            .mapToLong(DatasetListDTO::getDataPoints)
                            .average()
                            .orElse(0L), dsList, d.getUser().getId(), d.getInternal(),
                            dlList.stream().mapToInt(DownloadsByDay::getCount).sum(),
                            d.getPublishMDS(), d.getPublishedOn(), d.getFee1d(), d.getFee3mo(), d.getFee6mo(), d.getFee12mo(),
                            d.getUser().getVendor());

                });

        Page<DatasetResponseDTO> pageResult;
        List<DatasetResponseDTO> lst;
        if (publish == null) {
            if (free == null) {
                lst = data.collect(Collectors.toList());
            } else {
                lst = data.filter(dt -> dt.getFee() != null && (free ? dt.getFee().equals(0D) : dt.getFee() > 0))
                        .collect(Collectors.toList());
            }

        } else {
            if (free == null) {
                lst = data.filter(dt -> dt.getPublish() != null && (publish == dt.getPublish()))
                        .collect(Collectors.toList());
            } else {
                lst = data.filter(dt -> dt.getPublish() != null && (publish == dt.getPublish()) &&
                                dt.getFee() != null && (free ? dt.getFee().equals(0D) : dt.getFee() > 0))
                        .collect(Collectors.toList());
            }

        }

        int start = (int) paging.getOffset();
        int end = Math.min((start + paging.getPageSize()), lst.size());

        pageResult = new PageImpl<>(lst.subList(start, end), paging, lst.size());
        return new ResponseEntity<>(pageResult, HttpStatus.OK);
    }

    @GetMapping("/datasets")
    public ResponseEntity<Map<String, Object>> getAll(@RequestParam(required = false) Boolean publish) {
        Map<String, Object> response = new HashMap<>();

        Stream<DatasetResponseDTO> data = datasetDefinitionBusiness.getAll().stream().
                map(d -> {
                    List<DatasetListDTO> dsList = datasetBusiness.getAllByDatasetDefinitionId(d.getId());
                    List<DownloadsByDay> dlList = orderBusiness.getAllByDatasetDefinitionId(d.getId());

                    return new DatasetResponseDTO(d.getName(),
                            d.getDescription(), d.getCountryCode(), d.getCity(),
                            d.getFee(), d.getPublish(),
                            d.getOrganization(), d.getId(),
                            d.getUpdatedOn(), (long) dsList.stream().filter(o -> o != null && o.getDataPoints() != null)
                            .mapToLong(DatasetListDTO::getDataPoints)
                            .average()
                            .orElse(0L), dsList, d.getUser().getId(), d.getInternal(),
                            dlList.stream().mapToInt(DownloadsByDay::getCount).sum(),
                            d.getPublishMDS(), d.getPublishedOn(), d.getFee1d(), d.getFee3mo(), d.getFee6mo(), d.getFee12mo(),
                            d.getUser().getVendor());

                });

        if (publish == null) {
            response.put("data", data
                    .collect(Collectors.toList()));
        } else {
            if (publish) {
                response.put("data", data
                        .filter(dt -> dt.getPublish() != null && dt.getPublish())
                        .collect(Collectors.toList()));
            } else {
                response.put("data", data
                        .filter(dt -> dt.getPublish() != null && !dt.getPublish())
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
            if (publish != null) {
                if (publish) {
                    data = data.filter(dt -> dt.getPublish() != null && dt.getPublish());
                } else {
                    data = data  .filter(dt -> dt.getPublish() != null && !dt.getPublish());
                }
            }

            List<MyDatasetsDTO> dto = data.collect(Collectors.toList());
            if (dto.isEmpty()){
                return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
            }else{
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
                                                      @RequestBody DatasetDefinitionDTO dataset) throws DefaultException {
        Optional<User> userOpt = userRepository.findByUsername(AuthTokenFilter.usernameLoggedIn);
        Map<String, Object> response = new HashMap<>();
        if (userOpt.isPresent()) {
            User userData = userOpt.get();

            Optional<DatasetDefinition> opt = datasetDefinitionBusiness.getById(id);
            if (opt.isPresent()) {
                DatasetDefinition d = opt.get();
                if (userData.getId().equals(d.getUser().getId())) {
                    dataset.setUserId(d.getUser().getId());
                    response.put("data", datasetDefinitionBusiness.update(id, dataset));
                    return new ResponseEntity<>(response, HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
                }

            } else {
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

        } else {
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    //todo
    @GetMapping("/dataset/{datasetDefinitionId}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable UUID datasetDefinitionId) {
        Map<String, Object> response = new HashMap<>();
        Optional<DatasetDefinition> opt = datasetDefinitionBusiness.getById(datasetDefinitionId);
        if (opt.isPresent()) {
            DatasetDefinition d = opt.get();
            List<DatasetListDTO> dsList = datasetBusiness.getAllByDatasetDefinitionId(d.getId());
            List<DownloadsByDay> dlList = orderBusiness.getAllByDatasetDefinitionId(d.getId());

            response.put("data", new DatasetResponseDTO(d.getName(),
                    d.getDescription(), d.getCountryCode(), d.getCity(),
                    d.getFee(), d.getPublish(),
                    d.getOrganization(), d.getId(),
                    d.getUpdatedOn(), (long) dsList.stream().filter(o -> o != null && o.getDataPoints() != null)
                    .mapToLong(DatasetListDTO::getDataPoints)
                    .average()
                    .orElse(0L), dsList, d.getUser().getId(), d.getInternal(),
                    dlList.stream().mapToInt(DownloadsByDay::getCount).sum(),
                    d.getPublishMDS(), d.getPublishedOn(), d.getFee1d(), d.getFee3mo(), d.getFee6mo(), d.getFee12mo(),
                    d.getUser().getVendor()));
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

            Optional<DatasetDefinition> dd = datasetDefinitionBusiness.getById(id);
            if (dd.isPresent()) {
                DatasetDefinition datasetDef = dd.get();
                if (userData.getId().equals(datasetDef.getUser().getId()) ||
                        userData.getRoles().stream().map(r -> r.getName().name()).toList().contains(ERole.ROLE_ADMIN.name())) {
                    if (datasetDef.getInternal() != null && !datasetDef.getInternal()) {
                        try {
                            FileUtils.deleteDirectory(new File(PATH + "/" + datasetDef.getId()));
                        } catch (IOException e) {
                            logger.error(e.getMessage());
                        }
                    }

                    datasetDefinitionBusiness.delete(id);
                    return ResponseEntity.ok(new MessageResponse("Dataset definition deleted successfully!"));
                } else {
                    return ResponseEntity
                            .badRequest()
                            .body(new MessageResponse("Not authorized"));
                }

            } else {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Dataset definition not found"));
            }
        } else {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: User not found"));
        }
    }

    @DeleteMapping("/dataset/{id}")
    public ResponseEntity<?> deleteDataset(@PathVariable UUID id) {
        Optional<User> userOpt = userRepository.findByUsername(AuthTokenFilter.usernameLoggedIn);

        if (userOpt.isPresent()) {
            User userData = userOpt.get();
            Optional<Dataset> ds = datasetBusiness.getById(id);
            if (ds.isPresent()) {
                Dataset dataset = ds.get();
                Optional<DatasetDefinition> dd = datasetDefinitionBusiness.getById(dataset.getDatasetDefinition().getId());
                if (dd.isPresent()) {
                    DatasetDefinition datasetDef = dd.get();
                    if (userData.getId().equals(datasetDef.getUser().getId())||
                            userData.getRoles().stream().map(r -> r.getName().name()).toList().contains(ERole.ROLE_ADMIN.name())) {
                        if (datasetDef.getInternal() != null && !datasetDef.getInternal()) {
                            File files = new File(PATH + "/" + datasetDef.getId());
                            if (files.listFiles() != null) {
                                for (File f : files.listFiles()) {
                                    if (f.getName().contains(dataset.getId().toString())) {
                                        f.delete();
                                    }
                                }
                            }

                        }

                        datasetBusiness.delete(id);
                        return ResponseEntity.ok(new MessageResponse("Dataset deleted successfully!"));
                    } else {
                        return ResponseEntity
                                .badRequest()
                                .body(new MessageResponse("Not authorized"));
                    }
                } else {
                    return ResponseEntity
                            .badRequest()
                            .body(new MessageResponse("Error: Dataset definition not found"));
                }
            } else {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Dataset not found"));
            }
        } else {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: User not found"));
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

                    try {
                        Dataset dsSave = datasetBusiness.save(dataset);
                        if (dsSave != null) {
                            dd.setUpdatedOn(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime()));
                            dd.update(dd);
                            datasetDefinitionBusiness.save(dd);
                        }

                        response.put("data", dsSave);
                    } catch (Exception e) {
                        logger.error("Exception occurred " + e.getMessage());
                        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                    }

                } else {
                    logger.error("Dataset definition not found");
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
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
}