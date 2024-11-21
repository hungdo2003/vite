package com.swp391team3.koi_delivery_ordering_system.requestDto;

import lombok.Data;

@Data
public class EmailDetailDTO {
    Object receiver;
    String subject;
    String link;
}