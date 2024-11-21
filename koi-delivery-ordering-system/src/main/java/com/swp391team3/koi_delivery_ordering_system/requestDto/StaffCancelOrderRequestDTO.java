package com.swp391team3.koi_delivery_ordering_system.requestDto;

import lombok.Getter;

@Getter
public class StaffCancelOrderRequestDTO {
    private Long orderId;
    private Long userId;
    private int userType;
    private String cancelReason;
}
