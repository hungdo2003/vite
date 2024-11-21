package com.swp391team3.koi_delivery_ordering_system.service;

import com.swp391team3.koi_delivery_ordering_system.exception.ValidationException;
import com.swp391team3.koi_delivery_ordering_system.repository.CustomerRepository;
import com.swp391team3.koi_delivery_ordering_system.repository.DeliveryStaffRepository;
import com.swp391team3.koi_delivery_ordering_system.repository.ManagerRepository;
import com.swp391team3.koi_delivery_ordering_system.repository.SalesStaffRepository;
import org.springframework.stereotype.Service;

@Service
public class ValidationService {

    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$";
    private static final String PHONE_REGEX = "^(\\+84|0)[3-9]\\d{8}$";
    private final CustomerRepository customerRepository;
    private final DeliveryStaffRepository deliveryStaffRepository;
    private final SalesStaffRepository salesStaffRepository;
    private final ManagerRepository managerRepository;

    public ValidationService(CustomerRepository customerRepository, DeliveryStaffRepository deliveryStaffRepository, SalesStaffRepository salesStaffRepository, ManagerRepository managerRepository) {
        this.customerRepository = customerRepository;
        this.deliveryStaffRepository = deliveryStaffRepository;
        this.salesStaffRepository = salesStaffRepository;
        this.managerRepository = managerRepository;
    }

    public void validateEmail(String email) {
        if (email == null || !email.matches(EMAIL_REGEX)) {
            throw new ValidationException("Invalid email format");
        }
    }

    public void validatePhoneNumber(String phoneNumber) {
        if (phoneNumber == null || !phoneNumber.matches(PHONE_REGEX)) {
            throw new ValidationException("Invalid phone number format");
        }
    }
    public void validateEmailRegisteredActive(String email) {
        if(customerRepository.existsByEmailRegisteredActive(email)) {
            throw new ValidationException("Email already registered");
        }
    }
    public void validateEmailDeliveryStaffRegistered(String email) {
        if(deliveryStaffRepository.existsByEmail(email)) {
            throw new ValidationException("Email already registered in delivery staff list");
        }
    }
    public void validatePhoneNumberDeliveryStaffRegistered(String phoneNumber) {
        if(deliveryStaffRepository.existsByPhoneNumber(phoneNumber)) {
            throw new ValidationException("Phone number already registered in delivery staff list");
        }
    }
    public void validateEmailSalesStaffRegistered(String email) {
        if(salesStaffRepository.existsByEmail(email)) {
            throw new ValidationException("Email already registered in sales staff list");
        }
    }
    public void validatePhoneNumberSalesStaffRegistered(String phoneNumber) {
        if(deliveryStaffRepository.existsByPhoneNumber(phoneNumber)) {
            throw new ValidationException("Phone number already registered in sales staff list");
        }
    }
    public boolean validateEmailRegisteredNotActive(String email) {
        if(customerRepository.existsByEmailRegisteredNotActive(email)){
            return true;
        }
        return false;
    }
    public void validatePhoneNumberRegisteredActive(String phoneNumber) {
        if(customerRepository.existsByPhoneNumberRegisterdActive(phoneNumber)) {
            throw new ValidationException("Phone number already registered");
        }
    }
    public void validateDuplicateAddress(String senderAddress, String senderLatitude, String senderLongitude,
                                         String receiverAddress, String receiverLatitude, String receiverLongitude) {
        if (senderAddress.equalsIgnoreCase(receiverAddress) &&
                senderLatitude.equals(receiverLatitude) &&
                senderLongitude.equals(receiverLongitude)) {
            throw new ValidationException("Sender and receiver addresses cannot be the same");
        }
    }
    public void validateEmailManagerRegistered(String email) {
        if (managerRepository.existsByEmail(email)) {
            throw new ValidationException("Email already registered in manager list");
        }
    }

    public void validatePhoneNumberManagerRegistered(String phoneNumber) {
        if (managerRepository.existsByPhoneNumber(phoneNumber)) {
            throw new ValidationException("Phone number already registered in manager list");
        }
    }
}
