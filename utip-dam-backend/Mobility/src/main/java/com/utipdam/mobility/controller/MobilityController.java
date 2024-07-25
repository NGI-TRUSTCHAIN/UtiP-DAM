package com.utipdam.mobility.controller;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.hash.Hashing;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.RFC4180Parser;
import com.opencsv.RFC4180ParserBuilder;
import com.opencsv.exceptions.CsvValidationException;
import com.utipdam.mobility.FileUploadUtil;
import com.utipdam.mobility.SendEmail;
import com.utipdam.mobility.business.DatasetDefinitionBusiness;
import com.utipdam.mobility.business.DatasetBusiness;
import com.utipdam.mobility.business.OrderBusiness;
import com.utipdam.mobility.config.AuthTokenFilter;
import com.utipdam.mobility.config.RestTemplateClient;
import com.utipdam.mobility.model.*;
import com.utipdam.mobility.model.entity.*;
import com.utipdam.mobility.model.repository.RoleRepository;
import com.utipdam.mobility.model.repository.UserRepository;
import org.apache.commons.io.filefilter.WildcardFileFilter;
import org.apache.commons.validator.GenericValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.attribute.PosixFilePermissions;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.sql.Date;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.Callable;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@RestController
public class MobilityController {
    private static final Logger logger = LoggerFactory.getLogger(MobilityController.class);
    private final String START_TIME = "first_time_seen";
    private final String DATE_FORMAT = "yyyy-MM-dd";
    private final Integer HIGH_RISK = 10;
    private final Integer LOW_RISK = 50;
    private final String[] NEW_CSV_FORMAT = {"dataset_id", "location_id", "anonymized_unique_id", "start_time", "end_time", "distance"};

    @Value("${utipdam.app.maxFileSize}")
    private long MAX_FILE_SIZE;

    @Value("${utipdam.app.anonymization}")
    private String ANONYMIZATION_VERSION;

    @Value("${utipdam.app.audit}")
    private String AUDIT_VERSION;

    @Autowired
    private DatasetDefinitionBusiness datasetDefinitionBusiness;

    @Autowired
    private DatasetBusiness datasetBusiness;

    @Autowired
    private OrderBusiness orderBusiness;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private SendEmail sendEmail;
    @PostMapping(value = {"/mobility/upload", "/mobility/anonymize"})
    public ResponseEntity<?> anonymizeOnly(@RequestPart MultipartFile file,
                                           @RequestPart String k) {

        String errorMessage;

        if (file.isEmpty()) {
            errorMessage = "File is required";
            logger.error(errorMessage);

            return ResponseEntity.badRequest().body(errorMessage);
        }
        if (!Objects.requireNonNull(file.getOriginalFilename()).endsWith(".csv")) {
            errorMessage = "Please upload a csv file. You provided " + file.getOriginalFilename();
            logger.error(errorMessage);

            return ResponseEntity.badRequest().body(errorMessage);
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            errorMessage = "Exceeded max file size " + MAX_FILE_SIZE;
            logger.error(errorMessage);

            return ResponseEntity.badRequest().body(errorMessage);
        }
        if (!isNumeric(k) || (Integer.parseInt(k) < 0 || Integer.parseInt(k) > 100)) {
            errorMessage = "k must be a number between 0 - 100. You provided " + k;
            logger.error(errorMessage);

            return ResponseEntity.badRequest().body(errorMessage);
        }
        String strPath = null;
        try {
            StringBuffer inputBuffer = new StringBuffer();

            //anonymization process
            UUID uuid = UUID.randomUUID();
            String fileName = "upload-" + uuid + ".csv";
            String path = "/tmp";
            strPath = path + "/" + fileName;

            FileUploadUtil.saveFile(fileName, file, Paths.get(path));
            Scanner input = new Scanner(new File(strPath));
            int counter = 0;
            String csvDate;
            int dateIndex = -1;
            while(input.hasNextLine() && counter < 2)
            {
                String[] nextRecord = input.nextLine().split(",");

                if (counter > 0) {
                    if (dateIndex < 0){
                        errorMessage = "datetime not found. Please include the file header.";
                        logger.error(errorMessage);
                        return ResponseEntity.badRequest().body(errorMessage);
                    }
                    csvDate = nextRecord[dateIndex];
                    csvDate = csvDate.split(" ")[0];
                    if (!GenericValidator.isDate(csvDate, DATE_FORMAT, true)) {
                        errorMessage = "datetime must be yyyy-MM-dd HH:mm:ss format";
                        logger.error(errorMessage);
                        return ResponseEntity.badRequest().body(errorMessage);
                    }
                }else{
                    dateIndex = Arrays.asList(nextRecord).indexOf(START_TIME);
                    if (dateIndex < 0) {
                        dateIndex = Arrays.asList(nextRecord).indexOf("start_time");
                    }

                }
                counter++;
            }
            input.close();

            fileName = "dataset-" + uuid + ".csv";
            String strOutPath = path + "/" + fileName;

            File fi = new File(strOutPath);
            String pyPath = "/opt/utils/anonymization-v" + ANONYMIZATION_VERSION + ".py";
            logger.info("version " + ANONYMIZATION_VERSION);
            ProcessBuilder processBuilder = new ProcessBuilder("python3", pyPath, "--input", strPath, "--k", k);
            processBuilder.redirectErrorStream(true);
            processBuilder.redirectOutput(ProcessBuilder.Redirect.appendTo(fi));
            Process process = processBuilder.start();

            int exitVal = process.waitFor();
            logger.info("exitVal " + exitVal);
            if (exitVal == 0) {
                String line;
                BufferedReader br = new BufferedReader(new FileReader(strOutPath));
                long i = 0;

                String firstLine = br.readLine();
                String metrics = firstLine.contains("{'data':") ? firstLine.replaceAll("'", "\"") : null;

                while ((line = br.readLine()) != null) {
                    inputBuffer.append(line);
                    inputBuffer.append('\n');

                    i++;
                }

                logger.info("dataPoints:" + (i - 1));

                HttpHeaders responseHeaders = new HttpHeaders();

                String inputStr = inputBuffer.toString();

                ContentDisposition contentDisposition = ContentDisposition.builder("inline")
                        .filename("dataset.csv")
                        .build();

                responseHeaders.setContentDisposition(contentDisposition);

                responseHeaders.add("Performance-Metrics", metrics);
                InputStream inputStream = new ByteArrayInputStream(inputStr.getBytes(StandardCharsets.UTF_8));
                InputStreamResource resource = new InputStreamResource(inputStream);
                br.close();
                File f = new File(strPath);
                if (f.delete()) {
                    logger.info(f + " file deleted");
                }
                File fOut = new File(strOutPath);
                if (fOut.delete()) {
                    logger.info(fOut + " file deleted");
                }
                return ResponseEntity.ok()
                        .headers(responseHeaders)
                        .contentLength(inputStream.available())
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .body(resource);

            } else {
                try(InputStream inputStream = new FileInputStream(fi)) {

                    File f = new File(strPath);
                    if (f.delete()) {
                        logger.info(f + " file deleted");
                    }
                    File fOut = new File(strOutPath);
                    if (fOut.delete()) {
                        logger.info(fOut + " file deleted");
                    }
                    String text = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);

                    return ResponseEntity.internalServerError().body(text);
                }catch(IOException e){
                    errorMessage = e.getMessage();
                    logger.error(errorMessage);
                    return ResponseEntity.internalServerError().body(errorMessage);
                }

            }
        } catch (IOException | InterruptedException e) {
            if (strPath != null){
                File f = new File(strPath);
                if (f.delete()) {
                    logger.info(f + " file deleted");
                }
            }

            errorMessage = e.getMessage();
            logger.error(errorMessage);
            return ResponseEntity.internalServerError().body(errorMessage);
        }
    }

    @GetMapping("/mobility/download")
    public ResponseEntity<byte[]> download(@RequestParam UUID[] datasetIds) {
        String errorMessage;

        if (datasetIds.length < 1) {
            errorMessage = "Please select at least one dataset - datasetIds";
            logger.error(errorMessage);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Optional<Dataset> dataset = datasetBusiness.getById(datasetIds[0]);
        if (dataset.isPresent()) {
            Dataset datasetObj = dataset.get();

            Optional<DatasetDefinition> df = datasetDefinitionBusiness.getById(datasetObj.getDatasetDefinition().getId());

            if (df.isPresent()) {
                DatasetDefinition definitionObj = df.get();
                if (definitionObj.getFee() > 0D){
                    if (AuthTokenFilter.usernameLoggedIn == null){
                        errorMessage = "An api key is required to access premium datasets.";
                        logger.error(errorMessage);
                        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
                    }else{
                        Optional<User> userOpt = userRepository.findByUsername(AuthTokenFilter.usernameLoggedIn);
                        if (userOpt.isPresent()) {
                            if (!definitionObj.getUser().getId().equals(userOpt.get().getId())){
                                errorMessage = "An api key is required to access premium datasets.";
                                logger.error(errorMessage);
                                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
                            }
                        }else{
                            errorMessage = "An api key is required to access premium datasets.";
                            logger.error(errorMessage);
                            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
                        }
                    }

                }

                if (definitionObj.getInternal() == null || !definitionObj.getInternal()) {
                    String path = "/data/mobility/" + datasetObj.getDatasetDefinition().getId();
                    File dir = new File(path);

                    StreamingResponseBody streamResponse = clientOut -> {
                        try (ZipOutputStream zos = new ZipOutputStream(clientOut)) {
                            for (UUID datasetId : datasetIds) {
                                FileFilter fileFilter = new WildcardFileFilter("*dataset-" + datasetId + "-*");
                                File[] files = dir.listFiles(fileFilter);

                                if (files != null && files.length > 0) {
                                    File fi = files[0];
                                    addToZipFile(zos, new FileSystemResource(fi).getInputStream(), fi.getName());

                                }
                            }
                        } finally {
                            clientOut.close();
                        }

                    };
                    ByteArrayOutputStream os = new ByteArrayOutputStream(1024);
                    incrementDownload(definitionObj.getId());
                    try {
                        streamResponse.writeTo(os);
                        return ResponseEntity.ok()
                                .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=datasets.zip")
                                .contentType(MediaType.parseMediaType("application/zip")).body(os.toByteArray());

                    } catch (IOException ex) {
                        logger.error(ex.getMessage());
                        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                } else {
                    logger.info("downloading from internal server");
                    //download from internal archive server
                    RestTemplateClient restTemplate = new RestTemplateClient();
                    if (df.get().getServer() == null) {
                        logger.error("No internal server specified");
                        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                    String domain = df.get().getServer().getDomain();

                    if (domain != null) {
                        String uri = domain + "/internal/mobility/download";
                        logger.info(uri);
                        String strList = Arrays.toString(datasetIds);
                        String url = UriComponentsBuilder
                                .fromUriString(uri)
                                .queryParam("datasetDefinitionId", definitionObj.getId().toString())
                                .queryParam("datasetIds", strList.substring(1, strList.length() - 1).replaceAll(" ", "").trim())
                                .build().toUriString();
                        try {
                            ResponseEntity<Resource> exchange = restTemplate.restTemplate()
                                    .exchange(url, HttpMethod.GET, null, Resource.class);
                            byte[] inputStream = Objects.requireNonNull(exchange.getBody()).getContentAsByteArray();

                            incrementDownload(definitionObj.getId());

                            return ResponseEntity.ok()
                                    .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=datasets.zip")
                                    .contentType(MediaType.parseMediaType("application/zip")).body(inputStream);
                        } catch (KeyStoreException | NoSuchAlgorithmException | KeyManagementException |
                                 IOException ex) {
                            logger.error(ex.getMessage());
                            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                        }
                    }

                }
            }
        }

        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("/premium/download")
    public ResponseEntity<byte[]> downloadPremium(@RequestParam UUID[] datasetIds) {
        String errorMessage;
        Collection<UUID> paramList;
        DownloadDTO download = orderBusiness.download;
        if (!download.isPastDate() && !download.isFutureDate()){
            Collection<UUID> list = download.getDatasetIds();
            paramList = new ArrayList<>(List.of(datasetIds));
            paramList.retainAll( list );
            if (paramList.isEmpty()){
                errorMessage = "Invalid dataset id";
                logger.error(errorMessage);
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }else{
                datasetIds = paramList.toArray(new UUID[]{});
            }
        }


        if (datasetIds.length < 1) {
            errorMessage = "Please select at least one dataset - datasetIds";
            logger.error(errorMessage);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Optional<Dataset> dataset = datasetBusiness.getById(datasetIds[0]);
        if (dataset.isPresent()) {
            Dataset datasetObj = dataset.get();

            Optional<DatasetDefinition> df = datasetDefinitionBusiness.getById(datasetObj.getDatasetDefinition().getId());

            if (df.isPresent()) {
                DatasetDefinition definitionObj = df.get();
                if (definitionObj.getInternal() == null || !definitionObj.getInternal()) {
                    logger.info(definitionObj.getInternal().toString());
                    String path = "/data/mobility/" + datasetObj.getDatasetDefinition().getId();
                    File dir = new File(path);

                    UUID[] finalDatasetIds = datasetIds;
                    StreamingResponseBody streamResponse = clientOut -> {
                        try (ZipOutputStream zos = new ZipOutputStream(clientOut)) {
                            for (UUID datasetId : finalDatasetIds) {
                                FileFilter fileFilter = new WildcardFileFilter("*dataset-" + datasetId + "-*");
                                File[] files = dir.listFiles(fileFilter);

                                if (files != null && files.length > 0) {
                                    File fi = files[0];
                                    addToZipFile(zos, new FileSystemResource(fi).getInputStream(), fi.getName());

                                }
                            }
                        } finally {
                            clientOut.close();
                        }

                    };
                    ByteArrayOutputStream os = new ByteArrayOutputStream(1024);
                    incrementDownload(definitionObj.getId());
                    try {
                        streamResponse.writeTo(os);
                        return ResponseEntity.ok()
                                .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=datasets.zip")
                                .contentType(MediaType.parseMediaType("application/zip")).body(os.toByteArray());

                    } catch (IOException ex) {
                        logger.error(ex.getMessage());
                        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                } else {
                    logger.info("downloading from internal server");
                    //download from internal archive server
                    RestTemplateClient restTemplate = new RestTemplateClient();
                    if (df.get().getServer() == null) {
                        logger.error("No internal server specified");
                        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                    String domain = df.get().getServer().getDomain();

                    if (domain != null) {
                        String uri = domain + "/internal/mobility/download";
                        logger.info(uri);
                        String strList = Arrays.toString(datasetIds);
                        String url = UriComponentsBuilder
                                .fromUriString(uri)
                                .queryParam("datasetDefinitionId", definitionObj.getId().toString())
                                .queryParam("datasetIds", strList.substring(1, strList.length() - 1).replaceAll(" ", "").trim())
                                .build().toUriString();
                        try {
                            ResponseEntity<Resource> exchange = restTemplate.restTemplate()
                                    .exchange(url, HttpMethod.GET, null, Resource.class);
                            byte[] inputStream = Objects.requireNonNull(exchange.getBody()).getContentAsByteArray();

                            incrementDownload(definitionObj.getId());

                            return ResponseEntity.ok()
                                    .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=datasets.zip")
                                    .contentType(MediaType.parseMediaType("application/zip")).body(inputStream);
                        } catch (KeyStoreException | NoSuchAlgorithmException | KeyManagementException |
                                 IOException ex) {
                            logger.error(ex.getMessage());
                            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                        }
                    }

                }
            }
        }

        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    private void incrementDownload(UUID datasetDefinitionId) {
        DownloadsByDay downloadsByDay = orderBusiness.getByDatasetDefinitionIdAndDate(datasetDefinitionId, Date.valueOf(LocalDate.now()));
        if (downloadsByDay == null) {
            downloadsByDay = new DownloadsByDay(datasetDefinitionId, Date.valueOf(LocalDate.now()), 1);
            orderBusiness.saveDownloads(downloadsByDay);
        } else {
            orderBusiness.incrementCount(downloadsByDay.getId());
        }
    }

    private void addToZipFile(ZipOutputStream zos, InputStream fis, String filename) throws IOException {
        ZipEntry zipEntry = new ZipEntry(filename);
        zos.putNextEntry(zipEntry);
        byte[] bytes = new byte[1024];
        int length;
        while ((length = fis.read(bytes)) >= 0) {
            zos.write(bytes, 0, length);
        }
        zos.closeEntry();
        fis.close();
    }

    public static boolean isNumeric(String str) {
        try {
            Double.parseDouble(str);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    @PostMapping("/mobility/anonymizationJob")
    public ResponseEntity<?> anonymizeAndSave(@RequestPart MultipartFile file,
                                              @RequestPart String dataset) {
        ObjectMapper mapper = new ObjectMapper();
        String errorMessage;
        DatasetDefinitionDTO dto;
        try {
            JsonNode rootNode = mapper.readTree(dataset);
            dto = mapper.readValue(rootNode.toString(), DatasetDefinitionDTO.class);
        } catch (JsonProcessingException e) {
            errorMessage = e.getMessage();
            logger.error(errorMessage);
            return ResponseEntity.badRequest().body(errorMessage);
        }

        if (file.isEmpty()) {
            errorMessage = "File is required";
            logger.error(errorMessage);
            return ResponseEntity.badRequest().body(errorMessage);
        }
        if (!Objects.requireNonNull(file.getOriginalFilename()).endsWith(".csv")) {
            errorMessage = "Please upload a csv file. You provided " + file.getOriginalFilename();
            logger.error(errorMessage);
            return ResponseEntity.badRequest().body(errorMessage);
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            errorMessage = "Exceeded max file size " + MAX_FILE_SIZE;
            logger.error(errorMessage);
            return ResponseEntity.badRequest().body(errorMessage);
        }

        if ((dto.getK() < 0 || dto.getK() > 100)) {
            errorMessage = "k must be a number between 0 - 100. You provided " + dto.getK();
            logger.error(errorMessage);
            return ResponseEntity.badRequest().body(errorMessage);
        }
        if (dto.getName() == null) {
            errorMessage = "Name is required";
            logger.error(errorMessage);
            return ResponseEntity.badRequest().body(errorMessage);
        }

        if (dto.getCountryCode() == null) {
            errorMessage = "Country is required";
            logger.error(errorMessage);
            return ResponseEntity.badRequest().body(errorMessage);
        }

        if (dto.getOrganization() == null) {
            errorMessage = "Dataset owner organization details are required";
            logger.error(errorMessage);
            return ResponseEntity.badRequest().body(errorMessage);
        }

        if (AuthTokenFilter.usernameLoggedIn == null) {
            errorMessage = "Login is required";
            logger.error(errorMessage);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } else {
            Optional<User> user = userRepository.findByUsername(AuthTokenFilter.usernameLoggedIn);
            user.ifPresent(value -> dto.setUserId(value.getId()));
        }

        DatasetDefinition ds = datasetDefinitionBusiness.save(dto);

        File fOrg;
        String path = "/data/mobility/" + ds.getId();
        try {
            fOrg = new File(path);
            fOrg.setReadable(true, false);
            fOrg.setWritable(true, false);
            fOrg.mkdirs();
            Files.setPosixFilePermissions(Path.of("/data/mobility/" + ds.getId()), PosixFilePermissions.fromString("rwxrwxrwx"));
        } catch (IOException e) {
            errorMessage = e.getMessage();
            logger.error(errorMessage);
            return ResponseEntity.internalServerError().body(errorMessage);
        }

        String strPath = null;
        try {
            StringBuffer inputBuffer = new StringBuffer();

            //anonymization process
            UUID uuid = UUID.randomUUID();
            String fileName = "upload-" + uuid + ".csv";
            strPath = path + "/" + fileName;

            FileUploadUtil.saveFile(fileName, file, Paths.get(path));
            Scanner input = new Scanner(new File(strPath));
            int counter = 0;
            String csvDate = null;
            int dateIndex = -1;
            while(input.hasNextLine() && counter < 2)
            {
                String[] nextRecord = input.nextLine().split(",");

                if (counter > 0) {
                    if (dateIndex < 0){
                        errorMessage = "datetime not found. Please include the file header.";
                        logger.error(errorMessage);
                        return ResponseEntity.badRequest().body(errorMessage);
                    }
                    csvDate = nextRecord[dateIndex];
                    csvDate = csvDate.split(" ")[0];
                    if (!GenericValidator.isDate(csvDate, DATE_FORMAT, true)) {
                        errorMessage = "datetime must be yyyy-MM-dd HH:mm:ss format";
                        logger.error(errorMessage);
                        return ResponseEntity.badRequest().body(errorMessage);
                    }
                }else{
                    dateIndex = Arrays.asList(nextRecord).indexOf(START_TIME);
                    if (dateIndex < 0) {
                        dateIndex = Arrays.asList(nextRecord).indexOf("start_time");
                    }

                }
                counter++;
            }
            input.close();

            fileName = "dataset-" + uuid + "-.csv";
            String strOutPath = path + "/" + fileName;

            File fi = new File(strOutPath);
            String pyPath = "/opt/utils/anonymization-v" + ANONYMIZATION_VERSION + ".py";
            ProcessBuilder processBuilder = new ProcessBuilder("/bin/sh", "-c","python3 " + pyPath + " --input " + strPath + " --k " + dto.getK() + " | tail -n +2");
            processBuilder.redirectErrorStream(true);
            processBuilder.redirectOutput(ProcessBuilder.Redirect.appendTo(fi));
            Process process = processBuilder.start();

            int exitVal = process.waitFor();
            logger.info("exitVal " + exitVal);
            if (exitVal == 0) {
                String line;
                long i = 0;
                BufferedReader br = new BufferedReader(new FileReader(strOutPath));

                while ((line = br.readLine()) != null) {
                    inputBuffer.append(line);
                    inputBuffer.append('\n');
                    i++;
                }

                if (csvDate != null) {
                    String inputStr = inputBuffer.toString();
                    fileName = "dataset-" + uuid + "-" + csvDate + ".csv";
                    String strPathNew = path + "/" + fileName;
                    Path oldPath = Paths.get(strOutPath);
                    Path newPath = Paths.get(strPathNew);
                    Files.move(oldPath, newPath, StandardCopyOption.REPLACE_EXISTING);

                    long dataPoints = i - 1;
                    logger.info("dataPoints:" + dataPoints);
                    Dataset d = new Dataset();

                    d.setId(uuid);
                    d.setDatasetDefinition(ds);
                    d.setStartDate(Date.valueOf(csvDate));
                    d.setEndDate(Date.valueOf(csvDate));
                    d.setResolution(dto.getResolution());
                    d.setK(dto.getK());
                    d.setDataPoints(dataPoints);

                    datasetBusiness.save(d);

                    HttpHeaders responseHeaders = new HttpHeaders();

                    ContentDisposition contentDisposition = ContentDisposition.builder("inline")
                            .filename(fileName)
                            .build();
                    responseHeaders.setContentDisposition(contentDisposition);

                    InputStream inputStream = new ByteArrayInputStream(inputStr.getBytes(StandardCharsets.UTF_8));
                    InputStreamResource resource = new InputStreamResource(inputStream);
                    br.close();
                    File f = new File(strPath);
                    if (f.delete()) {
                        logger.info(f + " file deleted");
                    }

                    //if publish to MDS mobility data spaces, email admin
                    if (ds.getPublishMDS()){
                        Email email = new Email();
                        email.setContactEmail(ds.getOrganization().getEmail());
                        email.setName(ds.getOrganization().getName());
                        email.setSubject("[UtiP-DAM] Publish to MDS request");
                        email.setMessage("Publish to Mobility Data Spaces: Dataset " + ds.getId() + " " + ds.getName());
                        String responseMsg = sendEmail.send(email);
                        if (responseMsg.equals("Successfully sent")){
                            logger.info("Publish to MDS email sent.");
                        }
                    }

                    return ResponseEntity.ok()
                            .headers(responseHeaders)
                            .contentLength(inputStream.available())
                            .contentType(MediaType.APPLICATION_OCTET_STREAM)
                            .body(resource);
                }

            } else {
                try(InputStream inputStream = new FileInputStream(fi)) {

                    File f = new File(strPath);
                    if (f.delete()) {
                        logger.info(f + " file deleted");
                    }
                    String text = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
                    return ResponseEntity.internalServerError().body(text);
                }catch(IOException e){
                    errorMessage = e.getMessage();
                    logger.error(errorMessage);
                    return ResponseEntity.internalServerError().body(errorMessage);
                }
            }

        } catch (IOException | InterruptedException e) {
            File f = new File(strPath);
            if (f.delete()) {
                logger.info(f + " file deleted");
            }

            errorMessage = e.getMessage();
            logger.error(errorMessage);
            return ResponseEntity.internalServerError().body(errorMessage);
        }

        File f = new File(strPath);
        if (f.delete()) {
            logger.info(f + " file deleted");
        }

        errorMessage = "An error occurred while processing your request";
        logger.error(errorMessage);
        return ResponseEntity.internalServerError().body(errorMessage);

    }

    @PostMapping("/mobility/anonymizationJob/{datasetDefinitionId}")
    public ResponseEntity<?> addDataset(@PathVariable UUID datasetDefinitionId,
                                        @RequestPart MultipartFile file,
                                        @RequestPart String k) {

        String errorMessage;

        if (file.isEmpty()) {
            errorMessage = "File is required";
            logger.error(errorMessage);
            return ResponseEntity.badRequest().body(errorMessage);
        }
        if (!Objects.requireNonNull(file.getOriginalFilename()).endsWith(".csv")) {
            errorMessage = "Please upload a csv file. You provided " + file.getOriginalFilename();
            logger.error(errorMessage);
            return ResponseEntity.badRequest().body(errorMessage);
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            errorMessage = "Exceeded max file size " + MAX_FILE_SIZE;
            logger.error(errorMessage);
            return ResponseEntity.badRequest().body(errorMessage);
        }
        if (!isNumeric(k) || (Integer.parseInt(k) < 0 || Integer.parseInt(k) > 100)) {
            errorMessage = "k must be a number between 0 - 100. You provided " + k;
            logger.error(errorMessage);
            return ResponseEntity.badRequest().body(errorMessage);
        }


        if (AuthTokenFilter.usernameLoggedIn == null) {
            errorMessage = "Login is required";
            logger.error(errorMessage);
            return ResponseEntity.badRequest().body(errorMessage);
        }

        File fOrg;
        String path = "/data/mobility/" + datasetDefinitionId;
        try {
            fOrg = new File(path);
            fOrg.setReadable(true, false);
            fOrg.setWritable(true, false);
            fOrg.mkdirs();
            Files.setPosixFilePermissions(Path.of("/data/mobility/" + datasetDefinitionId), PosixFilePermissions.fromString("rwxrwxrwx"));
        } catch (IOException e) {
            errorMessage = e.getMessage();
            logger.error(errorMessage);
            return ResponseEntity.internalServerError().body(errorMessage);
        }

        String strPath = null;
        try {
            String csvDate = null;
            StringBuffer inputBuffer = new StringBuffer();

            //anonymization process
            UUID uuid = UUID.randomUUID();
            String fileName = "upload-" + uuid + ".csv";
            strPath = path + "/" + fileName;

            FileUploadUtil.saveFile(fileName, file, Paths.get(path));
            Scanner input = new Scanner(new File(strPath));
            int counter = 0;
            int dateIndex = -1;
            while(input.hasNextLine() && counter < 2)
            {
                String[] nextRecord = input.nextLine().split(",");

                if (counter > 0) {
                    if (dateIndex < 0){
                        errorMessage = "datetime not found. Please include the file header.";
                        logger.error(errorMessage);
                        return ResponseEntity.badRequest().body(errorMessage);
                    }
                    csvDate = nextRecord[dateIndex];
                    csvDate = csvDate.split(" ")[0];
                    if (!GenericValidator.isDate(csvDate, DATE_FORMAT, true)) {
                        errorMessage = "datetime must be yyyy-MM-dd HH:mm:ss format";
                        logger.error(errorMessage);
                        return ResponseEntity.badRequest().body(errorMessage);
                    }
                }else{
                    dateIndex = Arrays.asList(nextRecord).indexOf(START_TIME);
                    if (dateIndex < 0) {
                        dateIndex = Arrays.asList(nextRecord).indexOf("start_time");
                    }

                }
                counter++;
            }
            input.close();


            fileName = "dataset-" + uuid + "-.csv";
            String strOutPath = path + "/" + fileName;

            File fi = new File(strOutPath);
            String pyPath = "/opt/utils/anonymization-v" + ANONYMIZATION_VERSION + ".py";

            ProcessBuilder processBuilder = new ProcessBuilder("/bin/sh", "-c","python3 " + pyPath + " --input " + strPath + " --k " + k + " | tail -n +2");
            processBuilder.redirectErrorStream(true);
            processBuilder.redirectOutput(ProcessBuilder.Redirect.appendTo(fi));
            Process process = processBuilder.start();

            int exitVal = process.waitFor();
            logger.info("exitVal " + exitVal);
            if (exitVal == 0) {
                String line;
                long i = 0;
                BufferedReader br = new BufferedReader(new FileReader(strOutPath));

                while ((line = br.readLine()) != null) {
                    inputBuffer.append(line);
                    inputBuffer.append('\n');
                    i++;
                }

                if (csvDate != null) {
                    String inputStr = inputBuffer.toString();
                    fileName = "dataset-" + uuid + "-" + csvDate + ".csv";
                    String strPathNew = path + "/" + fileName;
                    Path oldPath = Paths.get(strOutPath);
                    Path newPath = Paths.get(strPathNew);
                    Files.move(oldPath, newPath, StandardCopyOption.REPLACE_EXISTING);

                    long dataPoints = i - 1;
                    logger.info("dataPoints:" + dataPoints);
                    Dataset d = new Dataset();
                    Optional<DatasetDefinition> ds = datasetDefinitionBusiness.getById(datasetDefinitionId);
                    if (ds.isPresent()) {
                        d.setId(uuid);
                        d.setDatasetDefinition(ds.get());
                        d.setStartDate(Date.valueOf(csvDate));
                        d.setEndDate(Date.valueOf(csvDate));
                        String RESOLUTION = "daily";
                        d.setResolution(RESOLUTION);
                        d.setK(Integer.valueOf(k));
                        d.setDataPoints(dataPoints);

                        datasetBusiness.save(d);

                        HttpHeaders responseHeaders = new HttpHeaders();

                        ContentDisposition contentDisposition = ContentDisposition.builder("inline")
                                .filename(fileName)
                                .build();
                        responseHeaders.setContentDisposition(contentDisposition);

                        InputStream inputStream = new ByteArrayInputStream(inputStr.getBytes(StandardCharsets.UTF_8));
                        InputStreamResource resource = new InputStreamResource(inputStream);
                        br.close();
                        File f = new File(strPath);
                        if (f.delete()) {
                            logger.info(f + " file deleted");
                        }
                        return ResponseEntity.ok()
                                .headers(responseHeaders)
                                .contentLength(inputStream.available())
                                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                                .body(resource);
                    } else {
                        errorMessage = "Dataset definition does not exist";
                        logger.error(errorMessage);
                        return ResponseEntity.notFound().build();
                    }
                }
            } else {
                InputStream inputStream = new FileInputStream(fi);
                InputStreamResource resource = new InputStreamResource(inputStream);
                HttpHeaders responseHeaders = new HttpHeaders();

                ContentDisposition contentDisposition = ContentDisposition.builder("inline")
                        .filename("error.txt")
                        .build();

                responseHeaders.setContentDisposition(contentDisposition);

                File f = new File(strPath);
                if (f.delete()) {
                    logger.info(f + " file deleted");
                }
                return ResponseEntity.internalServerError()
                        .headers(responseHeaders)
                        .contentLength(inputStream.available())
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .body(resource);

            }

        } catch (IOException | InterruptedException e) {
            File f = new File(strPath);
            if (f.delete()) {
                logger.info(f + " file deleted");
            }

            errorMessage = e.getMessage();
            logger.error(errorMessage);
            return ResponseEntity.internalServerError().body(errorMessage);
        }

        File f = new File(strPath);
        if (f.delete()) {
            logger.info(f + " file deleted");
        }

        errorMessage = "An error occurred while processing your request";
        logger.error(errorMessage);
        return ResponseEntity.internalServerError().body(errorMessage);

    }

    @GetMapping("/mobility/visitorDetection")
    public ResponseEntity<Map<String, Object>> findMeHere(@RequestParam Integer[] locationIds,
                                                          @RequestParam UUID datasetId) {
        Map<String, Object> response = new HashMap<>();
        String errorMessage;
        if (locationIds.length < 1) {
            errorMessage = "Please provide at least one location point - locationIds";
            logger.error(errorMessage);
            response.put("error", errorMessage);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        if (Arrays.stream(locationIds).anyMatch(item -> item == 0)) {
            errorMessage = "location id 0 is invalid";
            logger.error(errorMessage);
            response.put("error", errorMessage);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        List<Integer> locIdList = Arrays.stream(locationIds).toList();
        Optional<Dataset> datasetIdCheck = datasetBusiness.getById(datasetId);
        if (datasetIdCheck.isPresent()) {
            Dataset dataset = datasetIdCheck.get();
            Optional<DatasetDefinition> dd = datasetDefinitionBusiness.getById(dataset.getDatasetDefinition().getId());
            if (dd.isPresent()) {
                DatasetDefinition datasetDef = dd.get();

                RFC4180Parser rfc4180Parser = new RFC4180ParserBuilder().build();

                if (datasetDef.getInternal() == null || !datasetDef.getInternal()) {
                    File file = new File("/data/mobility/" + datasetDef.getId());
                    File[] files = file.listFiles((d, name) -> name.contains(dataset.getId().toString())); //only get 1 record
                    if (files != null && files.length > 0) {
                        if (files[0].getName().contains(dataset.getId().toString())) {
                            List<VisitorTracks> visitorTracks = new ArrayList<>();
                            List<VisitorTracksNew> visitorTracksNew = new ArrayList<>();
                            boolean newFormat = false;
                            try (CSVReader csvReader = new CSVReaderBuilder(new FileReader(files[0])).withSkipLines(1).withCSVParser(rfc4180Parser).build()) {
                                String[] nextRecord;
                                int i = 0;
                                while ((nextRecord = csvReader.readNext()) != null) {
                                    if (i == 0) {
                                        newFormat = Arrays.stream(nextRecord).count() == Arrays.stream(NEW_CSV_FORMAT).count();
                                        logger.info("new format " + newFormat);
                                    }

                                    if (newFormat) {
                                        VisitorTracksNew visitorTrackNew = createVisitorTrackNew(nextRecord);
                                        if (visitorTrackNew != null) {
                                            visitorTracksNew.add(visitorTrackNew);
                                        }
                                    } else {
                                        VisitorTracks visitorTrack = createVisitorTrack(nextRecord);
                                        if (visitorTrack != null) {
                                            visitorTracks.add(visitorTrack);
                                        }
                                    }
                                    i++;
                                }
                            } catch (IOException | CsvValidationException e) {
                                errorMessage = e.getMessage();
                                logger.error(errorMessage);
                                response.put("error", errorMessage);
                                return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
                            }
                            Map<String, List<Integer>> vIdMap;
                            if (newFormat) {
                                visitorTracksNew.sort(Comparator.comparing(VisitorTracksNew::getAnonymizedUniqueId)
                                        .thenComparing(VisitorTracksNew::getStartTime));
                                vIdMap = visitorTracksNew.stream().collect(Collectors.groupingBy(
                                        VisitorTracksNew::getAnonymizedUniqueId,
                                        Collectors.mapping(VisitorTracksNew::getLocationId, Collectors.toList())));
                            } else {
                                visitorTracks.sort(Comparator.comparing(VisitorTracks::getVisitorId)
                                        .thenComparing(VisitorTracks::getFirstTimeSeen));
                                vIdMap = visitorTracks.stream().filter(p -> p.getRegionId() > 0)
                                        .collect(Collectors.groupingBy(
                                                VisitorTracks::getVisitorId,
                                                Collectors.mapping(VisitorTracks::getRegionId, Collectors.toList())));
                            }
                            Map<String, List<Integer>> vIdMapFiltered = new HashMap<>();

                            Iterator<Map.Entry<String, List<Integer>>> iterator = vIdMap.entrySet().iterator();
                            Map.Entry<String, List<Integer>> prev = null;

                            while (iterator.hasNext()) {
                                Map.Entry<String, List<Integer>> next = iterator.next();

                                if (prev != null) {
                                    if (prev.getValue().size() > 1) {
                                        List<Integer> newList = new ArrayList<>();
                                        for (int i = 0; i < prev.getValue().size(); i++) {
                                            if ((i + 1) < prev.getValue().size()) {
                                                if (!Objects.equals(prev.getValue().get(i), prev.getValue().get(i + 1))) {
                                                    newList.add(prev.getValue().get(i));
                                                }
                                            } else {
                                                newList.add(prev.getValue().get(i));
                                            }
                                        }

                                        vIdMapFiltered.put(prev.getKey(), newList);
                                    } else {
                                        vIdMapFiltered.put(prev.getKey(), prev.getValue());
                                    }
                                }

                                prev = next;

                            }

                            //last entry
                            if (prev != null) {
                                if (prev.getValue().size() > 1) {
                                    List<Integer> newList = new ArrayList<>();
                                    for (int i = 0; i < prev.getValue().size(); i++) {
                                        if ((i + 1) < prev.getValue().size()) {
                                            if (!Objects.equals(prev.getValue().get(i), prev.getValue().get(i + 1))) {
                                                newList.add(prev.getValue().get(i));
                                            }
                                        } else {
                                            newList.add(prev.getValue().get(i));
                                        }

                                    }

                                    vIdMapFiltered.put(prev.getKey(), newList);
                                } else {
                                    vIdMapFiltered.put(prev.getKey(), prev.getValue());
                                }
                            }

                            int i = 0;

                            for (Map.Entry<String, List<Integer>> entry : vIdMapFiltered.entrySet()) {
                                if (Collections.indexOfSubList(entry.getValue(), locIdList) > -1) {
                                    i++;
                                }
                            }

                            response.put("count", i);
                            response.put("riskLevel", getRiskLevel(i));
                            return new ResponseEntity<>(response, HttpStatus.OK);
                        }

                    }


                } else {
                    logger.info("retrieving result from internal server");
                    //get response from internal server
                    RestTemplateClient restTemplate = new RestTemplateClient();
                    String domain = dd.get().getServer().getDomain();

                    if (domain != null) {
                        String uri = domain + "/internal/mobility/visitorDetection";

                        String url = UriComponentsBuilder
                                .fromUriString(uri)
                                .queryParam("datasetDefinitionId", datasetDef.getId())
                                .queryParam("datasetId", datasetId)
                                .queryParam("locationIds", Arrays.toString(locationIds).replaceAll(" ", ""))
                                .build().toUriString();
                        logger.info(url);
                        try {
                            JsonNode node = restTemplate.restTemplate().exchange(url,
                                    HttpMethod.GET, null, JsonNode.class).getBody();
                            if (node != null) {
                                JsonFactory jsonFactory = new JsonFactory();
                                ObjectMapper objectMapper = new ObjectMapper(jsonFactory);
                                JsonNode jsonNode = objectMapper.readValue(node.toString(), JsonNode.class);
                                if (jsonNode == null) {
                                    errorMessage = "An error occurred while processing your request";
                                    logger.error(errorMessage);
                                    response.put("error", errorMessage);
                                    return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                                } else {
                                    response.put("count", jsonNode.asInt());
                                    response.put("riskLevel", getRiskLevel(jsonNode.asInt()));
                                    return new ResponseEntity<>(response, HttpStatus.OK);
                                }
                            }
                        } catch (Exception ex) {
                            errorMessage = ex.getMessage();
                            logger.error(errorMessage);
                            response.put("error", errorMessage);
                            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                        }
                    }
                }
            }
        }
        errorMessage = "An error occurred while processing your request";
        logger.error(errorMessage);
        response.put("error", errorMessage);
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private RiskLevelDTO getRiskLevel(int count) {
        if (count < 1) {
            return new RiskLevelDTO(RiskLevel.no_match);
        }

        if (count < HIGH_RISK) {
            return new RiskLevelDTO(RiskLevel.high);
        } else if (count < LOW_RISK) {
            return new RiskLevelDTO(RiskLevel.low);
        } else {
            return new RiskLevelDTO(RiskLevel.no_risk);
        }

    }

    private static VisitorTracks createVisitorTrack(String[] metadata) {
        int siteId, regionId, populationType, globalId;
        String beginTime, endTime, visitorId;
        //site_id,region_id,visitor_id,device_id,device_type,population_type,global_id,first_time_seen,last_time_seen
        try {

            siteId = Integer.parseInt(metadata[0]);
            regionId = Integer.parseInt(metadata[1]);
            visitorId = metadata[2];
            populationType = Integer.parseInt(metadata[5]);
            globalId = Integer.parseInt(metadata[6]);

            beginTime = metadata[7];
            endTime = metadata[8];

            return new VisitorTracks(siteId, regionId, visitorId, populationType, globalId, beginTime, endTime);

        } catch (Exception e) {
            logger.error(e.getMessage());
            return null;
        }
    }

    private static VisitorTracksNew createVisitorTrackNew(String[] metadata) {
        int datasetId, locationId;
        String startTime, endTime, distance, anonymizedUniqueId;
        //dataset_id,location_id,anonymized_unique_id,start_time,end_time,distance
        try {

            datasetId = Integer.parseInt(metadata[0]);
            locationId = Integer.parseInt(metadata[1]);
            anonymizedUniqueId = metadata[2];
            startTime = metadata[3];
            endTime = metadata[4];
            distance = metadata[5];

            return new VisitorTracksNew(datasetId, locationId, anonymizedUniqueId, startTime, endTime, distance);

        } catch (Exception e) {
            logger.error(e.getMessage());
            return null;
        }
    }

    @PostMapping("/mobility/audit")
    public Callable<ResponseEntity<Map<String, Object>>> audit(@RequestPart MultipartFile file,
                                                               @RequestPart String k) {
        return () -> {
            String errorMessage;
            Map<String, Object> response = new HashMap<>();
            if (file.isEmpty()) {
                errorMessage = "File is required";
                logger.error(errorMessage);
                response.put("error", errorMessage);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            if (!Objects.requireNonNull(file.getOriginalFilename()).endsWith(".csv")) {
                errorMessage = "Please upload a csv file. You provided " + file.getOriginalFilename();
                logger.error(errorMessage);
                response.put("error", errorMessage);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            if (file.getSize() > MAX_FILE_SIZE) {
                errorMessage = "Exceeded max file size " + MAX_FILE_SIZE;
                logger.error(errorMessage);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            if (!isNumeric(k) || Integer.parseInt(k) < 2) {
                errorMessage = "k must be a number between 2 - dataset size. You provided " + k;
                logger.error(errorMessage);
                response.put("error", errorMessage);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            UUID uuid = UUID.randomUUID();
            String fileName = "upload-" + uuid + ".csv";
            String path = "/tmp";
            String strPath = path + "/" + fileName;


            try {
                FileUploadUtil.saveFile(fileName, file, Paths.get(path));
                Scanner input = new Scanner(new File(strPath));
                int counter = 0;
                String csvDate;
                int dateIndex = -1;
                while(input.hasNextLine() && counter < 2)
                {
                    String[] nextRecord = input.nextLine().split(",");

                    if (counter > 0) {
                        if (dateIndex < 0){
                            errorMessage = "datetime not found. Please include the file header.";
                            logger.error(errorMessage);
                            response.put("error", errorMessage);
                            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
                        }
                        csvDate = nextRecord[dateIndex];
                        csvDate = csvDate.split(" ")[0];
                        if (!GenericValidator.isDate(csvDate, DATE_FORMAT, true)) {
                            errorMessage = "datetime must be yyyy-MM-dd HH:mm:ss format";
                            logger.error(errorMessage);
                            response.put("error", errorMessage);
                            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
                        }
                    }else{
                        dateIndex = Arrays.asList(nextRecord).indexOf(START_TIME);
                        if (dateIndex < 0) {
                            dateIndex = Arrays.asList(nextRecord).indexOf("start_time");
                        }

                    }
                    counter++;
                }
                input.close();

                ProcessBuilder processBuilder = new ProcessBuilder("python3", "/opt/utils/audit-v" + AUDIT_VERSION + ".py", "--input", strPath, "--k", k);
                processBuilder.redirectErrorStream(true);
                Process process = processBuilder.start();
                //this will cause a timeout
                int exitVal = process.waitFor();
                logger.info("exitVal " + exitVal);
                String line;
                StringBuilder out = new StringBuilder();
                BufferedReader br = new BufferedReader(new InputStreamReader(process.getInputStream()));
                if (exitVal == 0) {
                    while ((line = br.readLine()) != null) {
                        out.append(line);
                    }
                    br.close();
                    File f = new File(strPath);
                    if (f.delete()) {
                        logger.info(f + " file deleted");
                    }
                    ObjectMapper mapper = new ObjectMapper();
                    JsonNode node = mapper.readValue(mapper.writeValueAsString(out).replaceAll("\"", "").replaceAll("'", "\""), JsonNode.class);

                    response.put("data", node.get("data"));
                    response.put("minK", node.get("minK"));
                    return new ResponseEntity<>(response, HttpStatus.OK);
                } else {
                    File f = new File(strPath);
                    if (f.delete()) {
                        logger.info(f + " file deleted");
                    }
                    errorMessage = "An error occurred while executing the file. Please check the file format.";
                    logger.error(errorMessage);
                    response.put("error", errorMessage);
                    return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
                }

            } catch (IOException | InterruptedException e) {
                File f = new File(strPath);
                if (f.delete()) {
                    logger.info(f + " file deleted");
                }
                errorMessage = e.getMessage();
                if (errorMessage == null){
                    errorMessage = "Timeout exceeded";
                }
                logger.error(errorMessage);
                response.put("error", errorMessage);
                return new ResponseEntity<>(response, HttpStatus.GATEWAY_TIMEOUT);
            }
        };

    }

    @GetMapping("/deviceToVisitorId")
    public String deviceToVisitorId(@RequestParam Integer sensorId, @RequestParam String mac) {
        return Hashing.sha256().hashString(sensorId + "_" + formatToValidMac(mac), StandardCharsets.UTF_8).toString();
    }

    private static String formatToValidMac(String mac) {
        return mac.replaceAll("[^a-zA-Z0-9]", "").toUpperCase();
    }
}