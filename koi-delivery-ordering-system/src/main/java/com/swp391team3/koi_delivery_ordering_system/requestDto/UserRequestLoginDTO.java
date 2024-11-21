package com.swp391team3.koi_delivery_ordering_system.requestDto;

import lombok.Getter;

@Getter
public class UserRequestLoginDTO {
    private String email;
    private String password;
    private int userType;
}
