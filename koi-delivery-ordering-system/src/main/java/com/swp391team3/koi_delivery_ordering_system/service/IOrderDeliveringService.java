package com.swp391team3.koi_delivery_ordering_system.service;

import com.swp391team3.koi_delivery_ordering_system.model.DeliveryStaff;
import com.swp391team3.koi_delivery_ordering_system.model.Order;
import com.swp391team3.koi_delivery_ordering_system.model.OrderDelivering;
import com.swp391team3.koi_delivery_ordering_system.requestDto.OrderDeliveringUpdateInfoRequestDTO;

import java.util.Optional;

public interface IOrderDeliveringService {
    void generateOrderGetting(Order order, DeliveryStaff deliveryStaff);
    void generateOrderDelivering(Order order, DeliveryStaff deliveryStaff);
    boolean startGetting(Long id, Long driverId);
    OrderDelivering updateDeliveringInfo(OrderDeliveringUpdateInfoRequestDTO request);
    Optional<OrderDelivering> getOrderDeliveringById(Long id);
    boolean finishDelivering(Long id);
    boolean startDelivering(Long orderId, Long deliveryStaffId);
}
