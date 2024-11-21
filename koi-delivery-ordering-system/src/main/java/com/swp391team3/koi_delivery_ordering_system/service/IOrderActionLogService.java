package com.swp391team3.koi_delivery_ordering_system.service;

import com.swp391team3.koi_delivery_ordering_system.model.DeliveryStaff;
import com.swp391team3.koi_delivery_ordering_system.model.Order;
import com.swp391team3.koi_delivery_ordering_system.model.SalesStaff;

public interface IOrderActionLogService {
    boolean logOrderAction(int roleId, Long userId, int actionType, Order order);
//    DeliveryStaff getDeliveryStaff(int roleId, Long userId, int actionType);
    SalesStaff getSalesStaff(int roleId, Long orderId, int actionType);
}
