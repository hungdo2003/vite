package com.swp391team3.koi_delivery_ordering_system.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import com.swp391team3.koi_delivery_ordering_system.model.Customer;
import com.swp391team3.koi_delivery_ordering_system.requestDto.UserRequestRegisterDTO;
import com.swp391team3.koi_delivery_ordering_system.requestDto.UserUpdateRequestDTO;
import org.springframework.web.multipart.MultipartFile;

public interface ICustomerService {
    boolean customerConfirm(String email);
    boolean customerLogin(String email, String password);
    Customer getCustomerByEmail(String email);
    
    List<Customer> getAllCustomer();
    Optional<Customer> getCustomerById(Long id);
    Customer updateCustomerById(Long id, String username, String email, String phoneNumber);
    void disableCustomerById(Long id);
    void enableCustomerById(Long id);

    String customerUpdateProfile(UserUpdateRequestDTO request);
    String customerUpdateAvatar(Long id, MultipartFile file) throws IOException;

    boolean registrationConfirm(UserRequestRegisterDTO request);
}

