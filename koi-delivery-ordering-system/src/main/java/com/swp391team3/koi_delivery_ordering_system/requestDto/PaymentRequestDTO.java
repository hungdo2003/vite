package com.swp391team3.koi_delivery_ordering_system.requestDto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequestDTO {
    private Long customerId;
    private Long orderId;
    private double amount;
}
