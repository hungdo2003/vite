package com.swp391team3.koi_delivery_ordering_system.service;

import java.util.List;
import java.util.Optional;

import com.swp391team3.koi_delivery_ordering_system.requestDto.StaffRequestCreationDTO;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.swp391team3.koi_delivery_ordering_system.model.Manager;
import com.swp391team3.koi_delivery_ordering_system.repository.ManagerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ManagerServiceImpl implements IManagerService{
    private final ManagerRepository managerRepository;
    private final PasswordEncoder passwordEncoder;
    private final ValidationService validationService;

    @Override
    public List<Manager> getAllManager() {
        return managerRepository.findAll();
    }

    @Override
    public Optional<Manager> getManagerById(Long id) {
        return managerRepository.findById(id);
    }

    @Override
    public Manager updateManager(Long id, String email, String username, String phoneNumber) {
        Optional<Manager> existingManager = managerRepository.findById(id);
        if(!existingManager.get().getEmail().equals(email)) {
            validationService.validateEmail(email);
            validationService.validateEmailManagerRegistered(email);
        } else if(!existingManager.get().getPhoneNumber().equals(phoneNumber)){
            validationService.validatePhoneNumber(phoneNumber);
            validationService.validatePhoneNumberManagerRegistered(phoneNumber);
        }
        if (existingManager.isPresent()) {
            Manager updatedManager = existingManager.get();
            updatedManager.setEmail(email);
            updatedManager.setPhoneNumber(phoneNumber);
            updatedManager.setUsername(username);
            return managerRepository.save(updatedManager);
        } else {
            throw new RuntimeException("Manager not found");
        }
    }

    @Override
    public void deleteManagerById(Long id) {
        managerRepository.deleteById(id);
    }

    @Override
    public boolean managerLogin(String email, String password) {
        Manager matchedManager = getManagerByEmail(email);
        if (matchedManager != null) {
            if (passwordEncoder.matches(password, matchedManager.getPassword())) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    @Override
    public String createNewManager(StaffRequestCreationDTO request) {
        Manager newManager = new Manager();

        validationService.validateEmail(request.getEmail());
        validationService.validatePhoneNumber(request.getPhoneNumber());
        validationService.validateEmailManagerRegistered(request.getEmail());
        validationService.validatePhoneNumberManagerRegistered(request.getPhoneNumber());

        newManager.setEmail(request.getEmail());
        newManager.setPhoneNumber(request.getPhoneNumber());
        String defaultPassword = "12345678";
        String encodedPassword = passwordEncoder.encode(defaultPassword);
        newManager.setPassword(encodedPassword);
        newManager.setUsername(request.getUsername());
        managerRepository.save(newManager);
        return "Account create successfully";
    }

    @Override
    public Manager getManagerByEmail(String email) {
        return managerRepository.findByEmail(email);
    }

    @Override
    public boolean editProfile(Long id, String email, String username, String phoneNumber, String password) {
        Optional<Manager> existingManager = managerRepository.findById(id);
        if(!existingManager.get().getEmail().equals(email)) {
            validationService.validateEmail(email);
            validationService.validateEmailManagerRegistered(email);
        } else if(!existingManager.get().getPhoneNumber().equals(phoneNumber)){
            validationService.validatePhoneNumber(phoneNumber);
            validationService.validatePhoneNumberManagerRegistered(phoneNumber);
        }
        if (existingManager.isPresent()) {
            Manager updatedManager = existingManager.get();
            updatedManager.setEmail(email);
            updatedManager.setPhoneNumber(phoneNumber);
            updatedManager.setUsername(username);
            String encodedPassword = passwordEncoder.encode(password);
            updatedManager.setPassword(encodedPassword);
            managerRepository.save(updatedManager);
            return true;
        } else {
            throw new RuntimeException("Manager not found");
        }
    }
}
