package com.swp391team3.koi_delivery_ordering_system.requestDto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Getter
@Setter
public class FishLicenseRequestDTO {
    private String licenseName;
    private String licenseDescription;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Date licenseDate;
    private Long fishId;
}
