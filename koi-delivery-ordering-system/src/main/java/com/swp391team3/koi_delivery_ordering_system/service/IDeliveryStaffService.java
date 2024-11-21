package com.swp391team3.koi_delivery_ordering_system.service;


import com.swp391team3.koi_delivery_ordering_system.model.DeliveryStaff;
import com.swp391team3.koi_delivery_ordering_system.requestDto.DeliveryStaffLocationUpdateRequestDTO;
import com.swp391team3.koi_delivery_ordering_system.requestDto.UserUpdateRequestDTO;

import java.io.IOException;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

public interface IDeliveryStaffService {
    String createDeliveryStaff(String email, String username, String phoneNumber);
    boolean deliveryStaffLogin(String email, String password);
    DeliveryStaff getDeliveryStaffByEmail(String email);

    List<DeliveryStaff> getAllDeliveryStaffs();
    Optional<DeliveryStaff> getDeliveryStaffById(Long id);
    DeliveryStaff updateDeliveryStaffById(Long id, String email, String phoneNumber, String username);

    boolean updateDeliveryStaffLocation(DeliveryStaffLocationUpdateRequestDTO request);

    String deliveryStaffUpdateProfile(UserUpdateRequestDTO request);
    String deliveryStaffUpdateAvatar(Long id, MultipartFile file) throws IOException;

    void disableDeliveryStaffById(Long id);
    void enableDeliveryStaffById(Long id);
}
