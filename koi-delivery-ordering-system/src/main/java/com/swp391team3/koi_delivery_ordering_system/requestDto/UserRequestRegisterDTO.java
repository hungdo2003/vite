package com.swp391team3.koi_delivery_ordering_system.requestDto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequestRegisterDTO {
    private String email;
    private String password;
    private String username;
    private String phoneNumber;
}
