package com.swp391team3.koi_delivery_ordering_system.requestDto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class LicenseFileRequestDTO {
    private Long licenseId;
    private MultipartFile file;
}
