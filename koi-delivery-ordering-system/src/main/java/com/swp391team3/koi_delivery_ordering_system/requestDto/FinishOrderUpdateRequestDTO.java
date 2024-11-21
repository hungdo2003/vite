package com.swp391team3.koi_delivery_ordering_system.requestDto;

import lombok.Getter;

@Getter
public class FinishOrderUpdateRequestDTO {
    private Long orderId;
    private Long orderDeliveringId;
    private Long deliveryStaffId;
    private Long storageId;
    private int processType;
}
