package com.swp391team3.koi_delivery_ordering_system.requestDto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class OrderFishInfoRequestDTO {
    private String fishName;
    private int fishAge;
    private double fishSize;
    private double fishWeight;
    private double fishPrice;
    private MultipartFile fishImage;
    private Long orderId;
}
