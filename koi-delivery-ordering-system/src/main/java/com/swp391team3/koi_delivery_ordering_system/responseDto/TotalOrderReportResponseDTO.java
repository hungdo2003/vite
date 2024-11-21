package com.swp391team3.koi_delivery_ordering_system.responseDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
public class TotalOrderReportResponseDTO {
    private int totalOrders;
    private int completedOrders;
    private int failedOrders;
    private int inProgressOrders;
    private int abortedOrders;
}
