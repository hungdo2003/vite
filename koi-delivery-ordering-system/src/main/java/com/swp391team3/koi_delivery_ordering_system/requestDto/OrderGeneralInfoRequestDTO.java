package com.swp391team3.koi_delivery_ordering_system.requestDto;

import lombok.Getter;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Getter
public class OrderGeneralInfoRequestDTO {
    private Long customerId;
    private String name;
    private String description;
    private String destinationAddress;
    private String destinationLongitude;
    private String destinationLatitude;
    private String senderAddress;
    private String senderLongitude;
    private String senderLatitude;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Date expectedFinishDate;
    private String receiverEmail;
    private String receiverPhoneNumber;
}
