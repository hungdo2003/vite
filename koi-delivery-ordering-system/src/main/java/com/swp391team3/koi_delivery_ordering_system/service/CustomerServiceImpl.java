package com.swp391team3.koi_delivery_ordering_system.service;

import com.swp391team3.koi_delivery_ordering_system.config.thirdParty.EmailService;
import com.swp391team3.koi_delivery_ordering_system.model.Customer;
import com.swp391team3.koi_delivery_ordering_system.model.File;
import com.swp391team3.koi_delivery_ordering_system.requestDto.UserRequestRegisterDTO;
import com.swp391team3.koi_delivery_ordering_system.requestDto.UserUpdateRequestDTO;
import com.swp391team3.koi_delivery_ordering_system.requestDto.EmailDetailDTO;
import com.swp391team3.koi_delivery_ordering_system.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements ICustomerService {
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final IFileService fileService;
    private final ValidationService validationService;

    @Override
    public boolean customerConfirm(String email) {
        Customer foundCustomer = getCustomerByEmail(email);
        if (foundCustomer != null) {
            foundCustomer.setActiveStatus(true);
            customerRepository.save(foundCustomer);
            return true;
        }
        return false;
    }

    @Override
    public boolean customerLogin(String email, String password) {
        Customer matchedCustomer = getCustomerByEmail(email);
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
    public Customer getCustomerByEmail(String email) {
        return customerRepository.findCustomerByEmail(email);
    }

    @Override
    public List<Customer> getAllCustomer() {
        return customerRepository.findAll();
    }

    @Override
    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    @Override
    public Customer updateCustomerById(Long id, String username, String email, String phoneNumber) {
        Optional<Customer> optionalCustomer = customerRepository.findById(id);
        if (optionalCustomer.isPresent()) {
            Customer customer = optionalCustomer.get();
            customer.setEmail(email);
            customer.setUsername(username);
            customer.setPhoneNumber(phoneNumber);
            return customerRepository.save(customer);
        } else {
            return null;
        }
    }

    @Override
    public void disableCustomerById(Long id) {
        Customer customer = customerRepository.findById(id).get();
        customer.setActiveStatus(false);
        customerRepository.save(customer);
    }
    @Override
    public void enableCustomerById(Long id) {
        Customer customer = customerRepository.findById(id).get();
        customer.setActiveStatus(true);
        customerRepository.save(customer);
    }

    @Override
    public String customerUpdateProfile(UserUpdateRequestDTO request) {
        Optional<Customer> optionalCustomer = customerRepository.findById(request.getId());
        if(!optionalCustomer.get().getEmail().equals(request.getEmail())) {
            validationService.validateEmail(request.getEmail());
            validationService.validateEmailRegisteredActive(request.getEmail());
        } else if(!optionalCustomer.get().getPhoneNumber().equals(request.getPhoneNumber())){
            validationService.validatePhoneNumber(request.getPhoneNumber());
            validationService.validatePhoneNumberRegisteredActive(request.getPhoneNumber());
        }
        Customer customerCheck = customerRepository.findCustomerByEmail(request.getEmail());
        if (customerCheck != null) {
            if ((!Objects.equals(customerCheck.getId(), optionalCustomer.get().getId()))
                    && (Objects.equals(customerCheck.getEmail(), optionalCustomer.get().getEmail()))) {
                return "This email already exist";
            }
        }

        Customer customer = optionalCustomer.get();
        if (!request.getPassword().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(request.getPassword());
            customer.setPassword(encodedPassword);
        }

        customer.setEmail(request.getEmail());
        customer.setUsername(request.getUsername ());
        customer.setPhoneNumber(request.getPhoneNumber());
        customerRepository.save(customer);
        return "Update Info Successfully";
    }

    @Override
    public String customerUpdateAvatar(Long id, MultipartFile file) throws IOException {
        Optional<Customer> customer = customerRepository.findById(id);
        if (customer.get().getFile() == null) {
            File newFile = fileService.uploadFileToFileSystem(file);
            if (newFile != null) {
                customer.get().setFile(newFile);
                customerRepository.save(customer.get());
                return "Update Avatar successfully";
            }
        } else {
            return fileService.updateFileInFileSystem(customer.get().getFile().getId(), file);
        }
        return "";
    }

    @Override
    public boolean registrationConfirm(UserRequestRegisterDTO request) {
        Customer newCustomer = new Customer();
        newCustomer.setEmail(request.getEmail());

        validationService.validatePhoneNumber(request.getPhoneNumber());
        validationService.validatePhoneNumberRegisteredActive(request.getPhoneNumber());
        validationService.validateEmailRegisteredActive(request.getEmail());
        if(validationService.validateEmailRegisteredNotActive(request.getEmail())){
            EmailDetailDTO emailDetail = new EmailDetailDTO();
            emailDetail.setReceiver((Object) newCustomer);
            emailDetail.setSubject("Welcome to KOI DELIVERY SYSTEM! We're glad you're here");
            emailDetail.setLink("http://localhost:8080/api/auth/register?email=" + newCustomer.getEmail());
            emailService.sendEmail(emailDetail, 1);
            return true;
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        newCustomer.setPassword(encodedPassword);
        newCustomer.setUsername(request.getUsername());
        newCustomer.setPhoneNumber(request.getPhoneNumber());
        newCustomer.setActiveStatus(false);

        customerRepository.save(newCustomer);

        EmailDetailDTO emailDetail = new EmailDetailDTO();
        emailDetail.setReceiver(newCustomer.getEmail());
        emailDetail.setSubject("Welcome to KOI DELIVERY SYSTEM! We're glad you're here");
        emailDetail.setLink("http://localhost:8080/api/auth/confirm-registration?email=" + newCustomer.getEmail());
        emailService.sendEmail(emailDetail, 1);

        return true;
    }

}
