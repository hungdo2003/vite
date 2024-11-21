package com.swp391team3.koi_delivery_ordering_system.service;

import com.swp391team3.koi_delivery_ordering_system.model.*;
import com.swp391team3.koi_delivery_ordering_system.requestDto.FinishOrderUpdateRequestDTO;
import com.swp391team3.koi_delivery_ordering_system.requestDto.OrderGeneralInfoRequestDTO;
import com.swp391team3.koi_delivery_ordering_system.requestDto.OrderListFilteredRequestDTO;
import com.swp391team3.koi_delivery_ordering_system.requestDto.StaffCancelOrderRequestDTO;
import com.swp391team3.koi_delivery_ordering_system.responseDto.OrderTrackingResponseDTO;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface IOrderService {
    Long createGeneralInfoOrder(OrderGeneralInfoRequestDTO dto);
    List<Order> getAllOrders();
    Optional<Order> getOrderById(Long id);
    boolean deleteOrderById(Long id);
    Storage filterOrderToStorage(String senderLatitude, String senderLongitude, String senderAddress);
    boolean postOrder(Long id);

    boolean updateOrderStatus(Long id, int status);
    List<Order> getOrderByStatus(int status);

    List<Order> getOrderByStatusFilteredByCustomer(OrderListFilteredRequestDTO request);

    double calculateOrderPrice(Long id);

//    List<Order> findOrdersForDelivery(Long id);
    List<Order> onGoingOrdersForDelivery(Long id, int deliveryProcessType, int orderStatus);

//    boolean updateOrderSalesAction(Long orderId, Long salesId, int action);
    Optional<OrderTrackingResponseDTO> getOrderByTrackingId(String trackingId);

    boolean finishOrder(FinishOrderUpdateRequestDTO request);

    Long updateOrder(Long orderId, String name, String description, Date expectedFinishDate,
                                       String destinationAddress, String destinationLongitude, String destinationLatitude,
                                       String senderAddress, String senderLongitude, String senderLatitude);

    boolean acceptOrder(Long orderId, Long salesId);

    boolean confirmOrder(Long orderId, Long salesId);

    boolean cancelOrder(StaffCancelOrderRequestDTO request) throws Exception;
    boolean abortOrder(Long orderId);
}
