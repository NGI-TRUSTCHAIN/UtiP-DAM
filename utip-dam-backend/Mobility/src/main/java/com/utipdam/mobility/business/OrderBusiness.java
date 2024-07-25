package com.utipdam.mobility.business;

import com.utipdam.mobility.config.BusinessService;
import com.utipdam.mobility.model.DownloadDTO;
import com.utipdam.mobility.model.entity.*;
import com.utipdam.mobility.model.service.*;
import org.springframework.beans.factory.annotation.Autowired;


import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;


@BusinessService
public class OrderBusiness {

    @Autowired
    private OrderDetailService orderDetailService;

    @Autowired
    private OrderItemService orderItemService;

    @Autowired
    private PaymentDetailService paymentDetailService;

    @Autowired
    private DownloadsByDayService downloadsByDayService;

    @Autowired
    private OrderItemDatasetService orderItemDatasetService;

    @Autowired
    private DatasetActivationService datasetActivationService;


    public DownloadDTO download;

    public OrderDetail saveOrderDetail(OrderDetail orderDetail){
        return orderDetailService.save(orderDetail);
    }

    public PaymentDetail savePaymentDetail(PaymentDetail paymentDetail){
        return paymentDetailService.save(paymentDetail);
    }

    public DatasetActivation saveDatasetActivation(DatasetActivation datasetActivation){
        return datasetActivationService.save(datasetActivation);
    }
    public OrderItem saveOrderItem(OrderItem orderItem){
        return orderItemService.save(orderItem);
    }

    public OrderItemDataset saveOrderItemDataset(OrderItemDataset orderItemDataset){
        return orderItemDatasetService.save(orderItemDataset);
    }

    public OrderDetail getOrderDetailByUserId(Long userId) {
        return orderDetailService.findByUserId(userId);
    }

    public Optional<OrderDetail> getOrderDetailById(Integer orderId) {
        return orderDetailService.findById(orderId);
    }

    public Optional<OrderItem> getOrderItemById(Integer id) {
        return orderItemService.findById(id);
    }

    public Optional<DatasetActivation> getByPaymentDetailId(Integer paymentDetailId) {
        return datasetActivationService.findByPaymentDetailId(paymentDetailId);
    }

    public List<OrderItemDataset> getAllByOrderItemId(Integer orderItemId) {
        return orderItemDatasetService.findAllByOrderItemId(orderItemId);
    }

    public List<OrderItem> getOrderItemByOrderId(Integer orderId) {
        return orderItemService.findAllByOrderId(orderId);
    }

    public List<OrderItem> getOrderItemByUserId(Long userId) {
        return orderItemService.findAllByUserId(userId);
    }

    public Optional<PaymentDetail> getPaymentById(Integer paymentId) {
        return paymentDetailService.findById(paymentId);
    }

    public List<PaymentDetail> getAllPurchasesByUserId(Long userId) {
        return paymentDetailService.findAllByUserId(userId);
    }
    public List<OrderItem> getAllPurchasesByUserIdAndIsActive(Long userId) {
        return orderItemService.findAllByUserIdAndIsActive(userId);
    }

    public List<OrderItemDataset> getAllSelectedDateByUserIdAndIsActive(Long userId) {
        return orderItemDatasetService.findAllSelectedDateByUserIdAndIsActive(userId);
    }
    public List<PaymentDetail> getAllPurchasesByDatasetOwnerIdAndIsActive(Long datasetOwnerId, Boolean active) {
        return paymentDetailService.findAllByDatasetOwnerIdAndIsActive(datasetOwnerId, active);
    }

    public List<PaymentDetail> getAllPurchasesByUserIdAndPaymentSource(Long userId, String paymentSource) {
        return paymentDetailService.findAllByUserIdAndPaymentSource(userId, paymentSource);
    }

    public List<PaymentDetail> getAllPurchasesByDatasetOwnerIdAndPaymentSource(Long datasetOwnerId, String paymentSource) {
        return paymentDetailService.findAllByDatasetOwnerIdAndPaymentSource(datasetOwnerId, paymentSource);
    }


    public boolean validateApiKey(UUID apiKey) {
        Optional<DatasetActivation> datasetActivationOpt = datasetActivationService.validateApiKey(apiKey);
        if (datasetActivationOpt.isPresent()) {
            DatasetActivation datasetActivation = datasetActivationOpt.get();
            LocalDate dt = datasetActivation.getExpirationDate().toLocalDate();
            LocalDate expirationDate = dt.plusDays(1);
            if (datasetActivation.isActive() && (expirationDate.isEqual(LocalDate.now()) || expirationDate.isAfter(LocalDate.now()))) {
                Optional<OrderItem> orderItemOpt = orderItemService.findById(datasetActivation.getOrderItemId());
                if (orderItemOpt.isPresent()) {
                    OrderItem order = orderItemOpt.get();
                    List<UUID> datasets = null;
                    if (order.isSelectedDate()) {
                        List<OrderItemDataset> orderItemDatasets = orderItemDatasetService.findAllByOrderItemId(order.getId());
                        datasets = orderItemDatasets.stream().map(OrderItemDataset::getDatasetId).collect(Collectors.toList());
                    }

                    DownloadDTO d = new DownloadDTO();
                    d.setDatasetDefinitionId(order.getDatasetDefinitionId());
                    d.setSelectedDate(order.isSelectedDate());
                    d.setPastDate(order.isPastDate());
                    d.setFutureDate(order.isFutureDate());
                    d.setDatasetIds(datasets);
                    download = d;
                }
                return true;
            }
        }
        return false;
    }

    public void incrementCount(Integer id){
        downloadsByDayService.incrementCount(id);
    }

    public DownloadsByDay getByDatasetDefinitionIdAndDate(UUID datasetDefinitionId, Date date) {
        return downloadsByDayService.findByDatasetDefinitionIdAndDate(datasetDefinitionId, date);
    }

    public List<DownloadsByDay> getAllByDatasetDefinitionId(UUID datasetDefinitionId) {
        return downloadsByDayService.findByDatasetDefinitionId(datasetDefinitionId);
    }

    public void saveDownloads(DownloadsByDay downloadsByDay){
        downloadsByDayService.save(downloadsByDay);
    }

    public void activateLicense(Integer id, boolean active) {
        Optional<PaymentDetail> pData = paymentDetailService.findById(id);
        if (pData.isPresent()){
            PaymentDetail paymentDetail = pData.get();
            if (paymentDetail.getStatus().equalsIgnoreCase(PaymentDetail.PaymentStatus.PENDING.name())){
                paymentDetail.setStatus(PaymentDetail.PaymentStatus.COMPLETED.name());
            }
            paymentDetail.setModifiedAt(new Timestamp(System.currentTimeMillis()));
        }

        Optional<DatasetActivation> data = datasetActivationService.findByPaymentDetailId(id);
        if (data.isPresent()){
            DatasetActivation datasetActivation = data.get();
            datasetActivation.setActive(active);
            datasetActivation.setModifiedAt(new Timestamp(System.currentTimeMillis()));
            datasetActivationService.save(datasetActivation);
        }
    }

    public void deleteInvoice(Integer id) {
        paymentDetailService.delete(id);
    }

    public void deleteActivation(Integer id) {
        datasetActivationService.delete(id);
    }

    public void deleteOrderDetail(Integer id) {
        orderDetailService.delete(id);
    }
    public void deleteOrderItem(Integer id) {
        orderItemService.delete(id);
    }
}
