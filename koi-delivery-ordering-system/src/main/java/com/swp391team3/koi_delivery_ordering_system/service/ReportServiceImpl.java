package com.swp391team3.koi_delivery_ordering_system.service;

import com.swp391team3.koi_delivery_ordering_system.model.DeliveryStaff;
import com.swp391team3.koi_delivery_ordering_system.model.Order;
import com.swp391team3.koi_delivery_ordering_system.model.OrderDelivering;
import com.swp391team3.koi_delivery_ordering_system.repository.DeliveryStaffRepository;
import com.swp391team3.koi_delivery_ordering_system.repository.OrderDeliveringRepository;
import com.swp391team3.koi_delivery_ordering_system.repository.OrderRepository;
import com.swp391team3.koi_delivery_ordering_system.responseDto.DeliveryStaffReportResponseDTO;
import com.swp391team3.koi_delivery_ordering_system.responseDto.TotalOrderReportResponseDTO;
import com.swp391team3.koi_delivery_ordering_system.utils.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements IReportService {
    private final OrderRepository orderRepository;
    private final DeliveryStaffRepository deliveryStaffRepository;
    private final OrderDeliveringRepository orderDeliveringRepository;
    private final OrderStatus orderStatus;

    @Override
    public TotalOrderReportResponseDTO getTotalOrdersInfo() {
        int totalOrders = (int) orderRepository.count();
        int totalCompletedOrders = orderRepository.countOrdersByStatus(orderStatus.COMPLETE);
        int totalFailedOrders = orderRepository.countOrdersByStatus(orderStatus.FAILED);
        int totalAbortedOrders = orderRepository.countOrdersByStatus(orderStatus.ABORTED_BY_CUSTOMER);
        int inProgressOrders = totalOrders - totalFailedOrders - totalAbortedOrders - totalCompletedOrders;
        return new TotalOrderReportResponseDTO(
                totalOrders,
                totalCompletedOrders,
                totalFailedOrders,
                totalAbortedOrders,
                inProgressOrders
        );
    }

    @Override
    public DeliveryStaffReportResponseDTO getDeliveryStaffReport(Long deliveryStaffId) {
        int totalGettingOrders = 0;
        int totalDeliveringOrders = 0;
        Optional<DeliveryStaff> foundDeliveryStaff = deliveryStaffRepository.findById(deliveryStaffId);
        if (foundDeliveryStaff.isPresent()) {
            List<OrderDelivering> orderDeliveringList = orderDeliveringRepository.getOrderDeliveringByDeliveryStaffId(deliveryStaffId);
            if (!orderDeliveringList.isEmpty()) {
                for (int i = 0; i < orderDeliveringList.size(); i++) {
                    if (orderDeliveringList.get(i).getDeliveryProcessType() == 0) {
                        totalGettingOrders++;
                    }

                    if (orderDeliveringList.get(i).getDeliveryProcessType() == 1) {
                        totalDeliveringOrders++;
                    }
                }
            }

            return new DeliveryStaffReportResponseDTO(
                    foundDeliveryStaff.get().getUsername(),
                    totalGettingOrders,
                    totalDeliveringOrders
            );
        }
        return null;
    }
}
