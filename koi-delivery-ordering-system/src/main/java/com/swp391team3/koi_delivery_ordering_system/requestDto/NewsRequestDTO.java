package com.swp391team3.koi_delivery_ordering_system.requestDto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class NewsRequestDTO {
    private String title;
    private String description;
    private String type;
    private Long salesStaffId;
    private MultipartFile file;
}
