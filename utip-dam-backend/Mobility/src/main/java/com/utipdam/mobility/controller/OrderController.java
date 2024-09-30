package com.utipdam.mobility.controller;


import com.utipdam.mobility.business.DatasetBusiness;
import com.utipdam.mobility.business.DatasetDefinitionBusiness;
import com.utipdam.mobility.business.OrderBusiness;
import com.utipdam.mobility.config.AuthTokenFilter;
import com.utipdam.mobility.model.*;
import com.utipdam.mobility.model.entity.*;
import com.utipdam.mobility.model.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
public class OrderController {
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderBusiness orderBusiness;

    @Autowired
    UserRepository userRepository;

    @Autowired
    private DatasetDefinitionBusiness datasetDefinitionBusiness;

    @Autowired
    private DatasetBusiness datasetBusiness;

    @Value("${utipdam.app.domain}")
    private String DOMAIN;

    private final int[] MONTH_LICENSE = {3, 6, 12};


    @GetMapping("/orders")
    public ResponseEntity<Map<String, Object>> getAll(@RequestParam Long userId) {
        Map<String, Object> response = new HashMap<>();

        response.put("data", orderBusiness.getOrderDetailByUserId(userId));

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/order/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();

        response.put("data", orderBusiness.getOrderDetailById(id));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    //paypal, bank transfer transactions
    @PostMapping("/checkout")
    public ResponseEntity<Map<String, Object>> order(@RequestBody OrderDTO order) {
        Map<String, Object> response = new HashMap<>();
        User user = getUser(AuthTokenFilter.usernameLoggedIn);
        if (user == null) {
            response.put("error", "User not found.");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } else {
            order.setUserId(user.getId());
            ResponseEntity<Map<String, Object>> responseDate = validateDate(order);
            if (responseDate != null) {
                return responseDate;
            }

            String currency = PaymentDetail.Currency.EUR.name();
            if (order.getCurrency() == null) {
                currency = PaymentDetail.Currency.EUR.name();
            } else {
                if (Arrays.stream(PaymentDetail.Currency.values()).noneMatch(i -> i.name().equals(order.getCurrency()))) {
                    response.put("error", "Invalid currency value. " + Arrays.asList(PaymentDetail.Currency.values()));
                    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
                }
            }

            ResponseEntity<Map<String, Object>> error = validate(order);
            if (error != null) {
                return error;
            }
            OrderDetail orderDetail = new OrderDetail(order.getUserId(), null, null);
            OrderDetail orderDetailSave = orderBusiness.saveOrderDetail(orderDetail);


            OrderItem orderItem = new OrderItem(order.getDatasetDefinitionId(), orderDetail.getId(),
                    order.isSelectedDate(), order.isPastDate(), order.isFutureDate(), order.getMonthLicense());
            OrderItem orderItemSave = orderBusiness.saveOrderItem(orderItem);

            if (order.isSelectedDate()) {
                for (UUID dataset : order.getDatasetIds()) {
                    OrderItemDataset orderItemDataset = new OrderItemDataset(orderItemSave.getId(), dataset);
                    orderBusiness.saveOrderItemDataset(orderItemDataset);
                }
            }

            DatasetActivation dsActivation = getDatasetActivation(order, currency, orderItemSave, orderDetailSave);
            if (dsActivation == null) {
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            } else {
                response.put("data", dsActivation);
            }

            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }


    @GetMapping("/myPurchases")
    public ResponseEntity<Map<String, Object>> myPurchases(@RequestParam(required = false) List<String> paymentStatus) {
        Map<String, Object> response = new HashMap<>();
        User user = getUser(AuthTokenFilter.usernameLoggedIn);
        if (user == null) {
            response.put("error", "User not found.");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } else {
            List<PaymentDetail> p = orderBusiness.getAllPurchasesByUserId(user.getId());
            if (paymentStatus != null) {
                paymentStatus = paymentStatus.stream()
                        .map(String::toLowerCase)
                        .collect(Collectors.toList());
                List<String> finalPaymentStatus = paymentStatus;
                p = p.stream().filter(mp -> finalPaymentStatus.contains(mp.getStatus().toLowerCase())).toList();
            }

            if (!p.isEmpty()) {
                List<PurchaseDTO> data = p.stream().
                        map(d -> {
                            Optional<DatasetActivation> datasetActivationOpt = orderBusiness.getByPaymentDetailId(d.getId());
                            if (datasetActivationOpt.isPresent()) {

                                DatasetActivation datasetActivation = datasetActivationOpt.get();

                                if (datasetActivation.getUserId().equals(user.getId())) {
                                    Optional<OrderItem> orderItemOpt = orderBusiness.getOrderItemById(datasetActivation.getOrderItemId());
                                    if (orderItemOpt.isPresent()) {
                                        OrderItem orderItem = orderItemOpt.get();
                                        List<UUID> datasetIds = null;
                                        List<String> selectedDates;
                                        if (orderItem.isSelectedDate()) {
                                            selectedDates = new ArrayList<>();
                                            datasetIds = orderBusiness.getAllByOrderItemId(datasetActivation
                                                    .getOrderItemId()).stream().map(OrderItemDataset::getDatasetId).collect(Collectors.toList());

                                            for (UUID id : datasetIds) {
                                                Optional<Dataset> dataset = datasetBusiness.getById(id);
                                                dataset.ifPresent(value -> selectedDates.add(String.valueOf(value.getStartDate())));
                                            }

                                        } else if (orderItem.isPastDate()) {
                                            List<DatasetListDTO> list = datasetBusiness.getAllByDatasetDefinitionId(orderItem.getDatasetDefinitionId());
                                            datasetIds = list.stream().map(DatasetListDTO::getId).collect(Collectors.toList());

                                            selectedDates = list.stream().map(dt -> dt.getFileDate().toString()).collect(Collectors.toList());
                                        } else {
                                            selectedDates = new ArrayList<>();
                                        }

                                        UUID datasetDefinitionId = orderItem.getDatasetDefinitionId();
                                        String url = DOMAIN + "/api/dataset/" + datasetDefinitionId;
                                        Optional<DatasetDefinition> dOpt = datasetDefinitionBusiness.getById(datasetDefinitionId);
                                        if (dOpt.isPresent()) {
                                            DatasetDefinition datasetDefinition = dOpt.get();
                                            String status = datasetActivation.isActive() && (d.getLicenseEndDate().after(new Date(System.currentTimeMillis())) || d.getLicenseEndDate().toLocalDate().isEqual(new Date(System.currentTimeMillis()).toLocalDate())) ? "ACTIVE" : "INACTIVE";

                                            return new PurchaseDTO(d.getId(), datasetDefinitionId, datasetDefinition.getName(), datasetDefinition.getDescription(),
                                                    datasetDefinition.getOrganization().getName(), datasetDefinition.getOrganization().getEmail(),
                                                    orderItem.isSelectedDate(), datasetIds, selectedDates, orderItem.isPastDate(), orderItem.isFutureDate(),
                                                    status, d.getStatus(), datasetActivation.getApiKey(), d.getLicenseStartDate(), d.getLicenseEndDate(), url,
                                                    d.getLicenseStartDate(), d.getAmount(), d.getCurrency(), d.getCreatedAt(), d.getModifiedAt());
                                        }
                                    }
                                }
                            }
                            return null;
                        }).collect(Collectors.toList());
                data.removeAll(Collections.singleton(null));
                if (!data.isEmpty()) {
                    response.put("data", data);
                    return new ResponseEntity<>(response, HttpStatus.OK);
                }
            }
        }
        return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
    }

    @GetMapping("/purchase/{id}")
    public ResponseEntity<Map<String, Object>> purchaseDetail(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        User user = getUser(AuthTokenFilter.usernameLoggedIn);
        if (user == null) {
            response.put("error", "User not found.");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } else {
            Optional<PaymentDetail> p = orderBusiness.getPaymentById(id);

            if (p.isPresent()) {
                PaymentDetail payment = p.get();
                Optional<DatasetActivation> datasetActivationOpt = orderBusiness.getByPaymentDetailId(payment.getId());
                if (datasetActivationOpt.isPresent()) {
                    DatasetActivation datasetActivation = datasetActivationOpt.get();
                    if (datasetActivation.getUserId().equals(user.getId())) {
                        Optional<OrderItem> orderItemOpt = orderBusiness.getOrderItemById(datasetActivation.getOrderItemId());
                        if (orderItemOpt.isPresent()) {
                            OrderItem orderItem = orderItemOpt.get();
                            List<UUID> datasetIds = null;
                            List<String> selectedDates;
                            if (orderItem.isSelectedDate()) {
                                selectedDates = new ArrayList<>();
                                datasetIds = orderBusiness.getAllByOrderItemId(datasetActivation
                                        .getOrderItemId()).stream().map(OrderItemDataset::getDatasetId).collect(Collectors.toList());

                                for (UUID dId : datasetIds) {
                                    Optional<Dataset> dataset = datasetBusiness.getById(dId);
                                    dataset.ifPresent(value -> selectedDates.add(String.valueOf(value.getStartDate())));
                                }

                            } else if (orderItem.isPastDate()) {
                                List<DatasetListDTO> list = datasetBusiness.getAllByDatasetDefinitionId(orderItem.getDatasetDefinitionId());
                                datasetIds = list.stream().map(DatasetListDTO::getId).collect(Collectors.toList());

                                selectedDates = list.stream().map(dt -> dt.getFileDate().toString()).collect(Collectors.toList());
                            } else {
                                selectedDates = new ArrayList<>();
                            }

                            UUID datasetDefinitionId = orderItem.getDatasetDefinitionId();
                            String url = DOMAIN + "/api/dataset/" + datasetDefinitionId;
                            Optional<DatasetDefinition> dOpt = datasetDefinitionBusiness.getById(datasetDefinitionId);
                            if (dOpt.isPresent()) {
                                DatasetDefinition datasetDefinition = dOpt.get();
                                String status = datasetActivation.isActive() && (payment.getLicenseEndDate().after(new Date(System.currentTimeMillis())) || payment.getLicenseEndDate().toLocalDate().isEqual(new Date(System.currentTimeMillis()).toLocalDate())) ? "ACTIVE" : "INACTIVE";

                                PurchaseDTO data = new PurchaseDTO(payment.getId(), datasetDefinitionId, datasetDefinition.getName(), datasetDefinition.getDescription(),
                                        datasetDefinition.getOrganization().getName(), datasetDefinition.getOrganization().getEmail(),
                                        orderItem.isSelectedDate(), datasetIds, selectedDates, orderItem.isPastDate(), orderItem.isFutureDate(), status, payment.getStatus(), datasetActivation.getApiKey(),
                                        payment.getLicenseStartDate(), payment.getLicenseEndDate(), url,
                                        payment.getLicenseStartDate(), payment.getAmount(), payment.getCurrency(), payment.getCreatedAt(), payment.getModifiedAt());
                                response.put("data", data);
                                return new ResponseEntity<>(response, HttpStatus.OK);

                            }
                        }
                    }
                }
            }
        }

        return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
    }

    @PostMapping("/license")
    public ResponseEntity<Map<String, Object>> createLicense(@RequestBody LicenseDTO license) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> error = validateLicenseNew(license);
        if (error != null) {
            return error;
        }
        User user = getUser(AuthTokenFilter.usernameLoggedIn);
        if (isOwner(user.getId(), license.getDatasetDefinitionId())) {
            Optional<User> recipientUserOpt = userRepository.findByEmail(license.getRecipientEmail());
            if (recipientUserOpt.isPresent()) {
                User recipientUser = recipientUserOpt.get();

                Optional<DatasetDefinition> datasetDefinitionOpt = datasetDefinitionBusiness.getById(license.getDatasetDefinitionId());
                DatasetDefinition datasetDefinition;
                if (datasetDefinitionOpt.isPresent()) {
                    datasetDefinition = datasetDefinitionOpt.get();
                } else {
                    response.put("error", "Dataset definition not found");
                    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
                }

                DatasetActivation datasetActivation = getDatasetActivation(recipientUser.getId(), license, datasetDefinition);

                if (datasetActivation == null){
                    response.put("error", "Dataset not found");
                    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
                }else{
                    response.put("data", datasetActivation);
                    return new ResponseEntity<>(response, HttpStatus.OK);
                }

            } else {
                response.put("error", "Recipient email does not exist. User not found");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }


        } else {
            response.put("error", "Only dataset owners are allowed to create new license.");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }

    }


    private DatasetActivation getDatasetActivation(Long userId, LicenseDTO license, DatasetDefinition datasetDefinition){
        OrderDetail orderDetail = new OrderDetail(userId, null, null);
        OrderDetail orderDetailSave = orderBusiness.saveOrderDetail(orderDetail);

        OrderItem orderItem = new OrderItem(license.getDatasetDefinitionId(), orderDetail.getId(),
                false, license.isPastDate(), license.isFutureDate(), license.getMonthLicense());
        OrderItem orderItemSave = orderBusiness.saveOrderItem(orderItem);


        Optional<DatasetDefinition> dtOpt = datasetDefinitionBusiness.getById(license.getDatasetDefinitionId());

        Date licenseStartDate = null, licenseEndDate = null;
        if (dtOpt.isPresent()) {
            if (license.isPastDate()) {
                licenseStartDate = licenseEndDate = new Date(System.currentTimeMillis());
            }

            if (license.isFutureDate()) {
                licenseStartDate = new Date(System.currentTimeMillis());
                LocalDate ld = licenseStartDate.toLocalDate();
                LocalDate monthLater;
                if (license.getMonthLicense() == 12) {
                    monthLater = ld.plusMonths(12);
                } else if (license.getMonthLicense() == 6) {
                    monthLater = ld.plusMonths(6);
                } else {
                    monthLater = ld.plusMonths(3);
                }
                licenseEndDate = Date.valueOf(monthLater);

            } else {
                license.setMonthLicense(null);
            }


        } else {
            return null;
        }

        PaymentDetail paymentDetailSave = savePaymentDetail(orderDetail, license, licenseStartDate, licenseEndDate);

        DatasetActivation datasetActivation = createApiKeyRequest(paymentDetailSave.getId(), orderItemSave.getId(),
                orderDetailSave.getUserId(), licenseEndDate,
                true, datasetDefinition.getUser().getId());
        DatasetActivation datasetActivationSave = orderBusiness.saveDatasetActivation(datasetActivation);
        updateOrderDetail(orderDetailSave, paymentDetailSave);
        return datasetActivationSave;
    }
    @GetMapping("/licenses/approval")
    public ResponseEntity<Map<String, Object>> getInvoices(@RequestParam(required = false) Boolean pending) {
        Map<String, Object> response = new HashMap<>();
        User user = getUser(AuthTokenFilter.usernameLoggedIn);
        if (user == null) {
            response.put("error", "User not found.");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } else {
            List<PaymentDetail> p = orderBusiness.getAllPurchasesByDatasetOwnerIdAndPaymentSource(user.getId(), "bank transfer");
            if (p == null) {
                return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
            } else {
                if (pending != null) {
                    if (pending) {
                        p = p.stream().filter(item -> !item.getStatus().equals(PaymentDetail.PaymentStatus.COMPLETED.name())).toList();
                    } else {
                        p = p.stream().filter(item -> item.getStatus().equals(PaymentDetail.PaymentStatus.COMPLETED.name())).toList();
                    }
                }

                DateFormat f = new SimpleDateFormat("yyyy-MM-dd");
                List<LicenseResponseDTO> licenseList = p.stream().map(d -> {
                    Optional<DatasetActivation> datasetActivationOpt = orderBusiness.getByPaymentDetailId(d.getId());
                    DatasetActivation datasetActivation = datasetActivationOpt.get();
                    User userData = userRepository.getReferenceById(datasetActivation.getUserId());

                    OrderItem orderItem = orderBusiness.getOrderItemByOrderId(d.getOrderId()).get(0);
                    Optional<DatasetDefinition> datasetDefinitionOpt = datasetDefinitionBusiness.getById(orderItem.getDatasetDefinitionId());
                    if (datasetDefinitionOpt.isPresent()) {
                        DatasetDefinition datasetDefinition = datasetDefinitionOpt.get();
                        return new LicenseResponseDTO(d.getId(), datasetDefinition.getId(), datasetDefinition.getName(),
                                datasetDefinition.getDescription(), datasetDefinition.getUser().getId(),
                                orderItem.isSelectedDate(), orderItem.isPastDate(), orderItem.isFutureDate(), orderItem.getMonthLicense(),
                                datasetActivation.getUserId(), userData.getUsername(), f.format(d.getCreatedAt()),
                                datasetActivation.isActive(), d.getLicenseStartDate().toString(), d.getLicenseEndDate().toString(),
                                d.getStatus(), d.getPaymentSource(), d.getAmount());
                    }
                    return null;
                }).collect(Collectors.toList());
                licenseList.removeAll(Collections.singleton(null));
                if (!licenseList.isEmpty()) {
                    response.put("data", licenseList);
                    return new ResponseEntity<>(response, HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
                }

            }
        }
    }

    @GetMapping("/licenses")
    public ResponseEntity<Map<String, Object>> getLicenses(@RequestParam Boolean active) {
        Map<String, Object> response = new HashMap<>();
        User user = getUser(AuthTokenFilter.usernameLoggedIn);
        if (user == null) {
            response.put("error", "User not found.");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } else {
            List<PaymentDetail> pActive = orderBusiness.getAllPurchasesByDatasetOwnerIdAndIsActive(user.getId(), true);
            List<PaymentDetail> p = orderBusiness.getAllPurchasesByDatasetOwnerIdAndIsActive(user.getId(), active);
            if (p == null) {
                return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
            } else {
                if (active) {
                    p = p.stream().filter(payment -> payment.getLicenseEndDate().after(new Date(System.currentTimeMillis())) || payment.getLicenseEndDate().toLocalDate().isEqual(new Date(System.currentTimeMillis()).toLocalDate())).collect(Collectors.toList());
                } else {
                    pActive = pActive.stream().filter(payment -> payment.getLicenseEndDate().before(new Date(System.currentTimeMillis()))).toList();
                    p.addAll(pActive);
                }

            }
            DateFormat f = new SimpleDateFormat("yyyy-MM-dd");
            List<LicenseResponseDTO> licenseList = p.stream().map(d -> {
                Optional<DatasetActivation> datasetActivationOpt = orderBusiness.getByPaymentDetailId(d.getId());
                if (datasetActivationOpt.isPresent()) {
                    DatasetActivation datasetActivation = datasetActivationOpt.get();
                    User userData = userRepository.getReferenceById(datasetActivation.getUserId());

                    OrderItem orderItem = orderBusiness.getOrderItemByOrderId(d.getOrderId()).get(0);
                    Optional<DatasetDefinition> datasetDefinitionOpt = datasetDefinitionBusiness.getById(orderItem.getDatasetDefinitionId());
                    if (datasetDefinitionOpt.isPresent()) {
                        DatasetDefinition datasetDefinition = datasetDefinitionOpt.get();

                        return new LicenseResponseDTO(d.getId(), datasetDefinition.getId(), datasetDefinition.getName(),
                                datasetDefinition.getDescription(), datasetDefinition.getUser().getId(),
                                orderItem.isSelectedDate(), orderItem.isPastDate(), orderItem.isFutureDate(), orderItem.getMonthLicense(),
                                datasetActivation.getUserId(), userData.getUsername(), f.format(d.getCreatedAt()),
                                datasetActivation.isActive(), d.getLicenseStartDate().toString(), d.getLicenseEndDate().toString(),
                                d.getStatus(), d.getPaymentSource(), d.getAmount());

                    }
                }

                return null;
            }).collect(Collectors.toList());

            licenseList.removeAll(Collections.singleton(null));
            if (!licenseList.isEmpty()) {
                response.put("data", licenseList);
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
            }
        }
    }

    @PatchMapping("/invoice/licenseActivation/{id}")
    public ResponseEntity<?> activateLicense(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        User user = getUser(AuthTokenFilter.usernameLoggedIn);
        if (user == null) {
            response.put("error", "User not found.");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } else {
            Optional<PaymentDetail> paymentOpt = orderBusiness.getPaymentById(id);
            if (paymentOpt.isPresent()) {
                PaymentDetail payment = paymentOpt.get();
                //if user owns the dataset in the license
                Optional<DatasetActivation> datasetActivationOpt = orderBusiness.getByPaymentDetailId(id);
                if (datasetActivationOpt.isPresent()) {
                    DatasetActivation datasetActivation = datasetActivationOpt.get();

                    if (datasetActivation.getDatasetOwnerId().equals(user.getId())) {

                        payment.setModifiedAt(new Timestamp(System.currentTimeMillis()));
                        orderBusiness.savePaymentDetail(payment);
                        orderBusiness.activateLicense(id, true);
                        response.put("status", "Activated");
                        return new ResponseEntity<>(response, HttpStatus.OK);
                    }
                }
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PatchMapping("/invoice/licenseDeactivation/{id}")
    public ResponseEntity<?> deactivateLicense(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        User user = getUser(AuthTokenFilter.usernameLoggedIn);
        if (user == null) {
            response.put("error", "User not found.");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } else {
            Optional<PaymentDetail> paymentOpt = orderBusiness.getPaymentById(id);
            if (paymentOpt.isPresent()) {
                PaymentDetail payment = paymentOpt.get();
                //if user owns the dataset in the license
                Optional<DatasetActivation> datasetActivationOpt = orderBusiness.getByPaymentDetailId(id);
                if (datasetActivationOpt.isPresent()) {
                    DatasetActivation datasetActivation = datasetActivationOpt.get();

                    if (datasetActivation.getDatasetOwnerId().equals(user.getId())) {

                        payment.setModifiedAt(new Timestamp(System.currentTimeMillis()));
                        orderBusiness.savePaymentDetail(payment);
                        orderBusiness.activateLicense(id, false);
                        response.put("status", "Deactivated");
                        return new ResponseEntity<>(response, HttpStatus.OK);
                    }
                }
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PatchMapping("/license/{id}")
    public ResponseEntity<Map<String, Object>> modifyLicense(@PathVariable Integer id,
                                                             @RequestBody LicenseDTO license) {
        Map<String, Object> response = new HashMap<>();

        ResponseEntity<Map<String, Object>> error = validateLicense(license);
        if (error != null) {
            return error;
        }
        User user = getUser(AuthTokenFilter.usernameLoggedIn);
        if (isOwner(user.getId(), id)) {
            //if user owns the dataset in the license
            DatasetActivation datasetActivation = orderBusiness.getByPaymentDetailId(id).get();
            Optional<OrderItem> orderItemOpt = orderBusiness.getOrderItemById(datasetActivation.getOrderItemId());
            if (orderItemOpt.isPresent()) {
                OrderItem orderItem = orderItemOpt.get();

                Optional<PaymentDetail> payOpt = orderBusiness.getPaymentById(id);
                if (payOpt.isPresent()) {
                    PaymentDetail pay = payOpt.get();
                    PaymentDetail paymentSave = null;

                    if (license.getMonthLicense() != null) {
                        orderItem.setFutureDate(true);
                        orderItem.setMonthLicense(license.getMonthLicense());
                        orderItem.setModifiedAt(new Timestamp(System.currentTimeMillis()));
                        orderBusiness.saveOrderItem(orderItem);

                        Date licenseStartDate, licenseEndDate;
                        if (pay.getLicenseStartDate() == null) {
                            licenseStartDate = new Date(System.currentTimeMillis());
                            pay.setLicenseStartDate(licenseStartDate);
                        } else {
                            licenseStartDate = pay.getLicenseStartDate();
                        }
                        LocalDate ld = licenseStartDate.toLocalDate();
                        LocalDate monthLater;
                        if (license.getMonthLicense() == 12) {
                            monthLater = ld.plusMonths(12);
                        } else if (license.getMonthLicense() == 6) {
                            monthLater = ld.plusMonths(6);
                        } else {
                            monthLater = ld.plusMonths(3);
                        }
                        licenseEndDate = Date.valueOf(monthLater);
                        pay.setLicenseEndDate(licenseEndDate);
                        pay.setModifiedAt(new Timestamp(System.currentTimeMillis()));
                        paymentSave = orderBusiness.savePaymentDetail(pay);

                        datasetActivation.setExpirationDate(paymentSave.getLicenseEndDate());
                        datasetActivation.setModifiedAt(new Timestamp(System.currentTimeMillis()));
                        orderBusiness.saveDatasetActivation(datasetActivation);

                    }
                    if (license.getLicenseStartDate() != null && license.getLicenseEndDate() != null) {
                        Date start = Date.valueOf(license.getLicenseStartDate());
                        Date end = Date.valueOf(license.getLicenseEndDate());
                        if (start.before(end) || start.equals(end)) {
                            pay.setLicenseStartDate(start);
                            pay.setLicenseEndDate(end);
                            pay.setModifiedAt(new Timestamp(System.currentTimeMillis()));
                            paymentSave = orderBusiness.savePaymentDetail(pay);

                            datasetActivation.setExpirationDate(paymentSave.getLicenseEndDate());
                            datasetActivation.setModifiedAt(new Timestamp(System.currentTimeMillis()));
                            orderBusiness.saveDatasetActivation(datasetActivation);

                        }
                    }

                    response.put("data", paymentSave == null ? pay : paymentSave);
                    return new ResponseEntity<>(response, HttpStatus.OK);
                }

            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    private boolean isOwner(Long userId, Integer id) {
        //if user owns the dataset in the license
        Optional<DatasetActivation> datasetActivationOpt = orderBusiness.getByPaymentDetailId(id);
        if (datasetActivationOpt.isPresent()) {
            DatasetActivation datasetActivation = datasetActivationOpt.get();
            return datasetActivation.getDatasetOwnerId().equals(userId);
        }
        return false;
    }

    private boolean isOwner(Long userId, UUID id) {
        //if user owns the dataset in the license
        Optional<DatasetDefinition> datasetOpt = datasetDefinitionBusiness.getById(id);
        //if user owns the dataset in the license
        return datasetOpt.map(datasetDefinition -> datasetDefinition.getUser().getId().equals(userId)).orElse(false);
    }

    @DeleteMapping("/license/{id}")
    public ResponseEntity<?> deleteLicense(@PathVariable Integer id) {
        User user = getUser(AuthTokenFilter.usernameLoggedIn);
        if (isOwner(user.getId(), id)) {
            PaymentDetail payment = orderBusiness.getPaymentById(id).get();
            DatasetActivation datasetActivation = orderBusiness.getByPaymentDetailId(id).get();
            //if (payment.getStatus().equalsIgnoreCase("LICENSE_ONLY")) {
            orderBusiness.deleteActivation(id);
            orderBusiness.deleteOrderItem(datasetActivation.getOrderItemId());
            orderBusiness.deleteOrderDetail(payment.getOrderId());
            return ResponseEntity.ok().build();
            //}
        }
        return ResponseEntity.notFound().build();
    }

    private ResponseEntity<Map<String, Object>> validateLicense(LicenseDTO license) {
        if (license.getMonthLicense() == null && license.getLicenseStartDate() == null && license.getLicenseEndDate() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else {
            if ((license.getLicenseStartDate() != null && license.getLicenseEndDate() == null) ||
                    (license.getLicenseStartDate() == null && license.getLicenseEndDate() != null)) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        }
        return null;
    }

    private ResponseEntity<Map<String, Object>> validateLicenseNew(LicenseDTO license) {
        Map<String, Object> response = new HashMap<>();

        if (!license.isPastDate() && !license.isFutureDate()) {
            response.put("error", "Select at least one: pastDate, futureDate");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        if (license.isFutureDate()) {
            if (license.getMonthLicense() == null) {
                response.put("error", "Please select future date month license");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            } else {
                if (Arrays.stream(MONTH_LICENSE).noneMatch(i -> i == license.getMonthLicense())) {
                    response.put("error", "Invalid license month value. " + Arrays.toString(MONTH_LICENSE));
                    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
                }
            }
        }
        return null;
    }


    private PaymentDetail savePaymentDetail(OrderDetail orderDetail, LicenseDTO license, Date licenseStartDate, Date licenseEndDate) {
        String currency = PaymentDetail.Currency.EUR.name();

        PaymentDetail paymentDetail = new PaymentDetail(orderDetail.getId(), 0D, license.getDescription(),
                currency, "LICENSE_ONLY", null,
                null, "provided");

        paymentDetail.setLicenseStartDate(licenseStartDate);
        paymentDetail.setLicenseEndDate(licenseEndDate);
        return orderBusiness.savePaymentDetail(paymentDetail);
    }

    private void updateOrderDetail(OrderDetail orderDetail, PaymentDetail paymentDetail) {
        //Updating order detail
        Optional<OrderDetail> orderDetailUpdate = orderBusiness.getOrderDetailById(orderDetail.getId());
        if (orderDetailUpdate.isPresent()) {
            OrderDetail od = orderDetailUpdate.get();
            od.setTotal(0D);
            od.setPaymentId(paymentDetail.getId());

            od.update(od);
            orderBusiness.saveOrderDetail(od);
        }

    }


    private ResponseEntity<Map<String, Object>> validate(OrderDTO order) {
        Map<String, Object> response = new HashMap<>();

        if (!order.isSelectedDate() && !order.isPastDate() && !order.isFutureDate()) {
            response.put("error", "Invalid selection. Select a date, past or future");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        if (order.isFutureDate()) {
            if (order.getMonthLicense() == null) {
                response.put("error", "Please select future date month license");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            } else {
                if (Arrays.stream(MONTH_LICENSE).noneMatch(i -> i == order.getMonthLicense())) {
                    response.put("error", "Invalid license month value. " + Arrays.toString(MONTH_LICENSE));
                    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
                }
            }
        }

        if (order.isSelectedDate()) {
            List<OrderItemDataset> items = orderBusiness.getAllSelectedDateByUserIdAndIsActive(order.getUserId());
            long count = items.stream().filter(i -> order.getDatasetIds().contains(i.getDatasetId())).count();

            if (count > 0) {
                response.put("error", "Duplicate order");
                return new ResponseEntity<>(response, HttpStatus.CONFLICT);
            }
        }

        if (order.isPastDate() || order.isFutureDate()) {
            List<OrderItem> items = orderBusiness.getAllPurchasesByUserIdAndIsActive(order.getUserId());
            long count = items.stream().filter(i -> i.getDatasetDefinitionId().equals(order.getDatasetDefinitionId())
                    && i.isPastDate() == order.isPastDate()
                    && i.isFutureDate() == order.isFutureDate()).count();

            if (count > 0) {
                response.put("error", "Duplicate order");
                return new ResponseEntity<>(response, HttpStatus.CONFLICT);
            }
        }

        return null;
    }

    private DatasetDefinition getDatasetDefinition(UUID id) {
        Optional<DatasetDefinition> datasetDefinitionOpt = datasetDefinitionBusiness.getById(id);
        return datasetDefinitionOpt.orElse(null);

    }

    private User getUser(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        return userOpt.orElse(null);
    }

    private DatasetActivation createApiKeyRequest(Integer paymentId, Integer orderItemId,
                                                  Long userId, Date expirationDate, Boolean active,
                                                  Long datasetOwnerId) {
        DatasetActivation apiKey = new DatasetActivation();
        apiKey.setPaymentDetailId(paymentId);
        apiKey.setOrderItemId(orderItemId);
        apiKey.setUserId(userId);
        apiKey.setApiKey(UUID.randomUUID());
        apiKey.setExpirationDate(expirationDate);
        apiKey.setDatasetOwnerId(datasetOwnerId);
        apiKey.setActive(active);

        return apiKey;
    }


    private ResponseEntity<Map<String, Object>> validateDate(OrderDTO order) {
        Map<String, Object> response = new HashMap<>();
        if (order.isSelectedDate()) {
            if (order.getDatasetIds() == null || order.getDatasetIds().isEmpty()) {
                response.put("error", "Select at least one date");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
        }
        return null;
    }

    private DatasetActivation getDatasetActivation(OrderDTO order, String currency,
                                                   OrderItem orderItem, OrderDetail orderDetail) {
        Optional<DatasetDefinition> dtOpt = datasetDefinitionBusiness.getById(order.getDatasetDefinitionId());
        double total = 0D;
        Date licenseStartDate = null, licenseEndDate = null;
        if (dtOpt.isPresent()) {
            DatasetDefinition dt = dtOpt.get();
            if (order.isSelectedDate()) {
                total += (dt.getFee1d() == null ? 0D : dt.getFee1d()) * order.getDatasetIds().size();
                licenseStartDate = licenseEndDate = new Date(System.currentTimeMillis());
            }

            if (order.isPastDate()) {
                total += (dt.getFee() == null ? 0D : dt.getFee());
                licenseStartDate = licenseEndDate = new Date(System.currentTimeMillis());
            }

            if (order.isFutureDate()) {
                licenseStartDate = new Date(System.currentTimeMillis());
                LocalDate ld = licenseStartDate.toLocalDate();
                LocalDate monthLater;
                if (order.getMonthLicense() == 12) {
                    total += (dt.getFee12mo() == null ? 0D : dt.getFee12mo());
                    monthLater = ld.plusMonths(12);
                } else if (order.getMonthLicense() == 6) {
                    total += (dt.getFee6mo() == null ? 0D : dt.getFee6mo());
                    monthLater = ld.plusMonths(6);
                } else {
                    total += (dt.getFee3mo() == null ? 0D : dt.getFee3mo());
                    monthLater = ld.plusMonths(3);
                }
                licenseEndDate = Date.valueOf(monthLater);

            } else {
                order.setMonthLicense(null);
            }

        } else {
            return null;
        }

        logger.info("Frontend total= " + order.getTotalAmount() + ", backend total = " + total);
        PaymentDetail paymentDetail = new PaymentDetail(orderDetail.getId(), order.getTotalAmount(), order.getDescription(),
                currency, order.getPaymentStatus(), order.getPaymentId(),
                order.getPayerId(), order.getPaymentSource());

        paymentDetail.setLicenseStartDate(licenseStartDate);
        paymentDetail.setLicenseEndDate(licenseEndDate);
        PaymentDetail paymentDetailSave = orderBusiness.savePaymentDetail(paymentDetail);


        DatasetDefinition datasetDefinition = getDatasetDefinition(order.getDatasetDefinitionId());
        if (datasetDefinition == null) {
            return null;
        }

        DatasetActivation datasetActivation = createApiKeyRequest(paymentDetailSave.getId(), orderItem.getId(),
                orderDetail.getUserId(), licenseEndDate,
                order.getPaymentSource().equalsIgnoreCase("paypal"), datasetDefinition.getUser().getId());
        if (order.getPaymentStatus().equalsIgnoreCase(PaymentDetail.PaymentStatus.FAILED.name())) {
            datasetActivation.setActive(false);
        }
        DatasetActivation datasetActivationSave = orderBusiness.saveDatasetActivation(datasetActivation);

        //Updating order detail
        Optional<OrderDetail> orderDetailUpdate = orderBusiness.getOrderDetailById(orderDetail.getId());
        if (orderDetailUpdate.isPresent()) {
            OrderDetail od = orderDetailUpdate.get();
            od.setTotal(order.getTotalAmount());
            od.setPaymentId(paymentDetailSave.getId());

            od.update(od);
            orderBusiness.saveOrderDetail(od);
        }
        return datasetActivationSave;
    }
}