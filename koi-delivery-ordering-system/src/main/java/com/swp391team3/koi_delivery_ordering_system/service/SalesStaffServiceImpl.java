package com.swp391team3.koi_delivery_ordering_system.service;

import com.swp391team3.koi_delivery_ordering_system.model.File;
import com.swp391team3.koi_delivery_ordering_system.model.SalesStaff;
import com.swp391team3.koi_delivery_ordering_system.repository.SalesStaffRepository;
import com.swp391team3.koi_delivery_ordering_system.requestDto.UserUpdateRequestDTO;

import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.util.Objects;
import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@Service
public class SalesStaffServiceImpl implements ISalesStaffService {
    private final SalesStaffRepository salesStaffRepository;
    private final PasswordEncoder passwordEncoder;
    private final IFileService fileService;
    private final ValidationService validationService;

    @Override
    public String createSalesStaff(String email, String username, String phoneNumber) {
        SalesStaff newSalesStaff = new SalesStaff();

        validationService.validatePhoneNumber(phoneNumber);
        validationService.validateEmail(email);
        validationService.validatePhoneNumberSalesStaffRegistered(phoneNumber);
        validationService.validateEmailSalesStaffRegistered(email);

        newSalesStaff.setEmail(email);

        String defaultPassword = "123";
        String encodedPassword = passwordEncoder.encode(defaultPassword);
        newSalesStaff.setPassword(encodedPassword);

        newSalesStaff.setUsername(username);
        newSalesStaff.setPhoneNumber(phoneNumber);

        salesStaffRepository.save(newSalesStaff);
        return "Account create successfully";
    }

    @Override
    public SalesStaff getSalesStaffByEmail(String email) {
        return salesStaffRepository.findSalesStaffByEmail(email);
    }

    @Override
    public boolean salesStaffLogin(String email, String password) {
        SalesStaff matchedCustomer = getSalesStaffByEmail(email);
        if (matchedCustomer != null) {
            if (passwordEncoder.matches(password, matchedCustomer.getPassword())) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    @Override
    public List<SalesStaff> getAllSalesStaff() {
        return salesStaffRepository.findAll();    
    }

    @Override
    public Optional<SalesStaff> getSalesStaffById(Long id) {
        return salesStaffRepository.findById(id);    
    }

    @Override
    public SalesStaff updateSalesStaff(Long id, String username, String email, String phoneNumber) {
        SalesStaff salesStaff = salesStaffRepository.findById(id).get();
        if(salesStaff != null) {
            if(!salesStaff.getEmail().equals(email)) {
                validationService.validateEmail(email);
                validationService.validateEmailSalesStaffRegistered(email);
            } else if(!salesStaff.getPhoneNumber().equals(phoneNumber)){
                validationService.validatePhoneNumber(phoneNumber);
                validationService.validatePhoneNumberSalesStaffRegistered(phoneNumber);
            }

            salesStaff.setEmail(email);
            salesStaff.setPhoneNumber(phoneNumber);
            salesStaff.setUsername(username);

            salesStaffRepository.save(salesStaff);
            return salesStaffRepository.save(salesStaff);
        }
        return null;
    }

    @Override
    public void disableSalesStaffById(Long id) {
        SalesStaff salesStaff = salesStaffRepository.findById(id).get();
        salesStaff.setActiveStatus(false);
        salesStaffRepository.save(salesStaff);
    }
    @Override
    public void enableSalesStaffById(Long id) {
        SalesStaff salesStaff = salesStaffRepository.findById(id).get();
        salesStaff.setActiveStatus(true);
        salesStaffRepository.save(salesStaff);
    }

    @Override
    public String salesStaffUpdateProfile(UserUpdateRequestDTO request) {
        Optional<SalesStaff> optionalSalesStaff = salesStaffRepository.findById(request.getId());

        SalesStaff salesStaffCheck = salesStaffRepository.findSalesStaffByEmail(request.getEmail());
        if(!salesStaffCheck.getEmail().equals(request.getEmail())) {
            validationService.validateEmail(request.getEmail());
            validationService.validateEmailSalesStaffRegistered(request.getEmail());
        } else if(!salesStaffCheck.getPhoneNumber().equals(request.getPhoneNumber())){
            validationService.validatePhoneNumber(request.getPhoneNumber());
            validationService.validatePhoneNumberSalesStaffRegistered(request.getPhoneNumber());
        }
        if (salesStaffCheck != null) {
            if ((!Objects.equals(salesStaffCheck.getId(), optionalSalesStaff.get().getId()))
                    && (Objects.equals(salesStaffCheck.getEmail(), optionalSalesStaff.get().getEmail()))) {
                return "This email already exist";
            }
        }

        SalesStaff salesStaff = optionalSalesStaff.get();
        if (!request.getPassword().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(request.getPassword());
            salesStaff.setPassword(encodedPassword);
        }

        salesStaff.setEmail(request.getEmail());
        salesStaff.setUsername(request.getUsername());
        salesStaff.setPhoneNumber(request.getPhoneNumber());
        salesStaffRepository.save(salesStaff);
        return "Update Info Successfully";
    }

    @Override
    public String salesStaffUpdateAvatar(Long id, MultipartFile file) throws IOException {
        Optional<SalesStaff> salesStaff = salesStaffRepository.findById(id);
        if (salesStaff.get().getFile() == null) {
            File newFile = fileService.uploadFileToFileSystem(file);
            if (newFile != null) {
                salesStaff.get().setFile(newFile);
                salesStaffRepository.save(salesStaff.get());
                return "Update Avatar successfully";
            }
        } else {
            return fileService.updateFileInFileSystem(salesStaff.get().getFile().getId(), file);
        }
        return "";
    }
}
