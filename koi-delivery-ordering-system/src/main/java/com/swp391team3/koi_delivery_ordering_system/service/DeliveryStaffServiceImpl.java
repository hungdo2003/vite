package com.swp391team3.koi_delivery_ordering_system.service;

import com.swp391team3.koi_delivery_ordering_system.model.DeliveryStaff;
import com.swp391team3.koi_delivery_ordering_system.model.File;
import com.swp391team3.koi_delivery_ordering_system.repository.DeliveryStaffRepository;
import com.swp391team3.koi_delivery_ordering_system.requestDto.DeliveryStaffLocationUpdateRequestDTO;
import com.swp391team3.koi_delivery_ordering_system.requestDto.UserUpdateRequestDTO;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.Objects;

@RequiredArgsConstructor
@Service
public class DeliveryStaffServiceImpl implements IDeliveryStaffService {
    private final DeliveryStaffRepository deliveryStaffRepository;
    private final PasswordEncoder passwordEncoder;
    private final IFileService fileService;
    private final ValidationService validationService;

    @Override
    public String createDeliveryStaff(String email, String username, String phoneNumber) {
        DeliveryStaff newDeliveryStaff = new DeliveryStaff();

        validationService.validateEmail(email);
        validationService.validatePhoneNumber(phoneNumber);
        validationService.validateEmailDeliveryStaffRegistered(email);
        validationService.validatePhoneNumberDeliveryStaffRegistered(phoneNumber);

        newDeliveryStaff.setEmail(email);

        //Default password when create staffs
        String defaultPassword = "123";
        String encodedPassword = passwordEncoder.encode(defaultPassword);
        newDeliveryStaff.setPassword(encodedPassword);

        newDeliveryStaff.setUsername(username);
        newDeliveryStaff.setPhoneNumber(phoneNumber);

        deliveryStaffRepository.save(newDeliveryStaff);
        return "Account create successfully";
    }

    @Override
    public boolean deliveryStaffLogin(String email, String password) {
        DeliveryStaff matchedDeliveryStaff = getDeliveryStaffByEmail(email);
        if (matchedDeliveryStaff != null) {
            if (passwordEncoder.matches(password, matchedDeliveryStaff.getPassword())) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    @Override
    public DeliveryStaff getDeliveryStaffByEmail(String email) {
        return  deliveryStaffRepository.findDeliveryStaffByEmail(email);
    }

    @Override
    public List<DeliveryStaff> getAllDeliveryStaffs() {
        return deliveryStaffRepository.findAll();
    }

    @Override
    public Optional<DeliveryStaff> getDeliveryStaffById(Long id) {
        return deliveryStaffRepository.findById(id);
    }

    @Override
    public DeliveryStaff updateDeliveryStaffById(Long id, String email, String phoneNumber, String username) {
        Optional<DeliveryStaff> optionalDeliveryStaff = deliveryStaffRepository.findById(id);
        if (optionalDeliveryStaff.isPresent()) {
            if(!optionalDeliveryStaff.get().getEmail().equals(email)) {
                validationService.validateEmail(email);
                validationService.validateEmailDeliveryStaffRegistered(email);
            } else if(!optionalDeliveryStaff.get().getPhoneNumber().equals(phoneNumber)) {
                validationService.validatePhoneNumber(phoneNumber);
                validationService.validatePhoneNumberDeliveryStaffRegistered(phoneNumber);
            }

            DeliveryStaff deliveryStaff = optionalDeliveryStaff.get();
            deliveryStaff.setEmail(email);
            deliveryStaff.setPhoneNumber(phoneNumber);
            deliveryStaff.setUsername(username);

            return deliveryStaffRepository.save(deliveryStaff);
        } else {
            return null;
        }
    }

    @Override
    public boolean updateDeliveryStaffLocation(DeliveryStaffLocationUpdateRequestDTO request) {
        Optional<DeliveryStaff> foundDeliveryStaff = getDeliveryStaffById(request.getId());
        if (foundDeliveryStaff.isPresent()) {
            foundDeliveryStaff.get().setAddress(request.getAddress());
            foundDeliveryStaff.get().setLatitude(request.getLatitude());
            foundDeliveryStaff.get().setLongitude(request.getLongitude());
            deliveryStaffRepository.save(foundDeliveryStaff.get());
            return true;
        }
        return false;
    }

    @Override
    public String deliveryStaffUpdateProfile(UserUpdateRequestDTO request) {
        Optional<DeliveryStaff> optionalDeliveryStaff = deliveryStaffRepository.findById(request.getId());

        if(!optionalDeliveryStaff.get().getEmail().equals(request.getEmail())) {
            validationService.validateEmail(request.getEmail());
            validationService.validateEmailDeliveryStaffRegistered(request.getEmail());
        } else if(!optionalDeliveryStaff.get().getPhoneNumber().equals(request.getPhoneNumber())) {
            validationService.validatePhoneNumber(request.getPhoneNumber());
            validationService.validatePhoneNumberDeliveryStaffRegistered(request.getPhoneNumber());
        }

        DeliveryStaff deliveryStaffCheck = deliveryStaffRepository.findDeliveryStaffByEmail(request.getEmail());
        if (deliveryStaffCheck != null) {
            if ((!Objects.equals(deliveryStaffCheck.getId(), optionalDeliveryStaff.get().getId()))
                    && (Objects.equals(deliveryStaffCheck.getEmail(), optionalDeliveryStaff.get().getEmail()))) {
                return "This email already exist";
            }
        }

        DeliveryStaff deliveryStaff = optionalDeliveryStaff.get();
        if (!request.getPassword().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(request.getPassword());
            deliveryStaff.setPassword(encodedPassword);
        }

        deliveryStaff.setUsername(request.getUsername());
        deliveryStaff.setEmail(request.getEmail());
        deliveryStaff.setPhoneNumber(request.getPhoneNumber());
        deliveryStaffRepository.save(deliveryStaff);
        return "Update Info Successfully";
    }

    @Override
    public String deliveryStaffUpdateAvatar(Long id, MultipartFile file) throws IOException {
        Optional<DeliveryStaff> deliveryStaff = deliveryStaffRepository.findById(id);
        if (deliveryStaff.get().getFile() == null) {
            File newFile = fileService.uploadFileToFileSystem(file);
            if (newFile != null) {
                deliveryStaff.get().setFile(newFile);
                deliveryStaffRepository.save(deliveryStaff.get());
                return "Update Avatar successfully";
            }
        } else {
            return fileService.updateFileInFileSystem(deliveryStaff.get().getFile().getId(), file);
        }
        return "";
    }
    @Override
    public void disableDeliveryStaffById(Long id) {
        DeliveryStaff deliveryStaff = deliveryStaffRepository.findById(id).get();
        deliveryStaff.setActiveStatus(false);
        deliveryStaffRepository.save(deliveryStaff);
    }
    @Override
    public void enableDeliveryStaffById(Long id) {
        DeliveryStaff deliveryStaff = deliveryStaffRepository.findById(id).get();
        deliveryStaff.setActiveStatus(true);
        deliveryStaffRepository.save(deliveryStaff);
    }
}
