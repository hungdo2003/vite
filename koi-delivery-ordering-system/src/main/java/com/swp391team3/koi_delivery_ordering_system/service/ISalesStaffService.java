package com.swp391team3.koi_delivery_ordering_system.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.swp391team3.koi_delivery_ordering_system.model.SalesStaff;
import com.swp391team3.koi_delivery_ordering_system.requestDto.UserUpdateRequestDTO;

public interface ISalesStaffService {
    String createSalesStaff(String email, String username, String phoneNumber);
    SalesStaff getSalesStaffByEmail(String email);
    boolean salesStaffLogin(String email, String password);

    List<SalesStaff> getAllSalesStaff();
    Optional<SalesStaff> getSalesStaffById(Long id);
    SalesStaff updateSalesStaff(Long id, String username, String email, String phoneNumber);

    void disableSalesStaffById(Long id);
    void enableSalesStaffById(Long id);

    String salesStaffUpdateProfile(UserUpdateRequestDTO request);
    String salesStaffUpdateAvatar(Long id, MultipartFile file) throws IOException;
}
