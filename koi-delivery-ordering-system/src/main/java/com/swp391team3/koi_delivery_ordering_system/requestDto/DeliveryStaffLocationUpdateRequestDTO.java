package com.swp391team3.koi_delivery_ordering_system.requestDto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DeliveryStaffLocationUpdateRequestDTO {
    private Long id;
    private String address;
    private String latitude;
    private String longitude;
}
