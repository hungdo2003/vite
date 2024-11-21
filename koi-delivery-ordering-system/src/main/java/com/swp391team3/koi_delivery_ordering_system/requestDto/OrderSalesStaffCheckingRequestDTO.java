package com.swp391team3.koi_delivery_ordering_system.requestDto;

import lombok.Getter;

@Getter
public class OrderSalesStaffCheckingRequestDTO {
    private Long orderId;
    private Long salesId;
    private int actionStatus;
}
