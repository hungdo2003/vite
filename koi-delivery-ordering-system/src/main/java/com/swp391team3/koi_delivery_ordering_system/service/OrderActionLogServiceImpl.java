package com.swp391team3.koi_delivery_ordering_system.service;

import com.swp391team3.koi_delivery_ordering_system.model.DeliveryStaff;
import com.swp391team3.koi_delivery_ordering_system.model.Order;
import com.swp391team3.koi_delivery_ordering_system.model.OrderActionLog;
import com.swp391team3.koi_delivery_ordering_system.model.SalesStaff;
import com.swp391team3.koi_delivery_ordering_system.repository.OrderActionLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class OrderActionLogServiceImpl implements IOrderActionLogService {
    private final OrderActionLogRepository orderActionLogRepository;
    private final ISalesStaffService salesStaffService;
    private final IDeliveryStaffService deliveryStaffService;

    @Override
    public boolean logOrderAction(int roleId, Long userId, int actionType, Order order) {
        OrderActionLog log = new OrderActionLog();
        log.setActionType(actionType);
        log.setOrder(order);
        log.setRoleId(roleId);
        log.setUserId(userId);
        orderActionLogRepository.save(log);
        return true;
    }

//    @Override
//    public DeliveryStaff getDeliveryStaff(int roleId, Long orderId, int actionType) {
//        Long deliveryStaffId = orderActionLogRepository.getUserId(roleId, orderId, actionType);
//        Optional<DeliveryStaff> result = deliveryStaffService.getDeliveryStaffById(deliveryStaffId);
//        return result.orElse(null);
//    }

    @Override
    public SalesStaff getSalesStaff(int roleId, Long orderId, int actionType) {
        Long salesStaffId = orderActionLogRepository.getUserId(roleId, orderId, actionType);
        Optional<SalesStaff> result = salesStaffService.getSalesStaffById(salesStaffId);
        return result.orElse(null);
    }
}
