package com.swp391team3.koi_delivery_ordering_system.service;

import java.util.List;
import java.util.Optional;

import com.swp391team3.koi_delivery_ordering_system.model.Manager;
import com.swp391team3.koi_delivery_ordering_system.requestDto.StaffRequestCreationDTO;

public interface IManagerService {
    List<Manager> getAllManager();
    Optional<Manager> getManagerById(Long id);
    Manager updateManager(Long id, String email, String username, String phoneNumber);
    void deleteManagerById(Long id);
    boolean managerLogin(String email, String password);
    String createNewManager(StaffRequestCreationDTO request);
    Manager getManagerByEmail(String email);
    boolean editProfile(Long id, String email, String username, String phoneNumber, String password);
}
