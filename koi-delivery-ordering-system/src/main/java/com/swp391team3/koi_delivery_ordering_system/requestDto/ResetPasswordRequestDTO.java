package com.swp391team3.koi_delivery_ordering_system.requestDto;

import lombok.Getter;

@Getter
public class ResetPasswordRequestDTO {
    private String email;
    private int userType;
    private String password;
}
