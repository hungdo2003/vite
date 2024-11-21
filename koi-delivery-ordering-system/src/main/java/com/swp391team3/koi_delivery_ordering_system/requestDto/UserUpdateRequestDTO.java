package com.swp391team3.koi_delivery_ordering_system.requestDto;

import lombok.Getter;

@Getter
public class UserUpdateRequestDTO {
    private Long id;
    private String email;
    private String username;
    private String phoneNumber;
    private String password;
}
