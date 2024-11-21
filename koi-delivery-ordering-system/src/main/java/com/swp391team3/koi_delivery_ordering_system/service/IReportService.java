package com.swp391team3.koi_delivery_ordering_system.service;

import com.swp391team3.koi_delivery_ordering_system.responseDto.DeliveryStaffReportResponseDTO;
import com.swp391team3.koi_delivery_ordering_system.responseDto.TotalOrderReportResponseDTO;

public interface IReportService {
    TotalOrderReportResponseDTO getTotalOrdersInfo();
    DeliveryStaffReportResponseDTO getDeliveryStaffReport(Long deliveryStaffId);
}
