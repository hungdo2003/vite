package com.swp391team3.koi_delivery_ordering_system.requestDto;

import lombok.Getter;

@Getter
public class CustomerFeedbackRequestDTO {
    private Long orderId;
    private Long userId;
    private String comment;
    private int rateStar;
}
