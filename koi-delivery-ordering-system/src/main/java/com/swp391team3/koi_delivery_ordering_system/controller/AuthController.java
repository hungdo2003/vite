package com.swp391team3.koi_delivery_ordering_system.controller;

import com.swp391team3.koi_delivery_ordering_system.config.thirdParty.EmailService;
import com.swp391team3.koi_delivery_ordering_system.exception.ValidationException;
import com.swp391team3.koi_delivery_ordering_system.model.Customer;
import com.swp391team3.koi_delivery_ordering_system.model.DeliveryStaff;
import com.swp391team3.koi_delivery_ordering_system.model.Manager;
import com.swp391team3.koi_delivery_ordering_system.model.SalesStaff;
import com.swp391team3.koi_delivery_ordering_system.repository.CustomerRepository;
import com.swp391team3.koi_delivery_ordering_system.repository.DeliveryStaffRepository;
import com.swp391team3.koi_delivery_ordering_system.repository.ManagerRepository;
import com.swp391team3.koi_delivery_ordering_system.repository.SalesStaffRepository;
import com.swp391team3.koi_delivery_ordering_system.requestDto.*;
import com.swp391team3.koi_delivery_ordering_system.service.ICustomerService;
import com.swp391team3.koi_delivery_ordering_system.service.IDeliveryStaffService;
import com.swp391team3.koi_delivery_ordering_system.service.IManagerService;
import com.swp391team3.koi_delivery_ordering_system.service.ISalesStaffService;
import com.swp391team3.koi_delivery_ordering_system.config.security.TokenService;
import com.swp391team3.koi_delivery_ordering_system.utils.UserType;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final ICustomerService customerService;
    private final ISalesStaffService salesStaffService;
    private final IDeliveryStaffService deliveryStaffService;
    private final IManagerService managerService;

    @Autowired
    TokenService tokenService;
    @Autowired
    EmailService emailService;
    @Autowired
    PasswordEncoder passwordEncoder;
    private final CustomerRepository customerRepository;
    private final SalesStaffRepository salesStaffRepository;
    private final DeliveryStaffRepository deliveryStaffRepository;
    private final ManagerRepository managerRepository;

    @PostMapping(value = "/login")
    public ResponseEntity<?> login(@RequestBody UserRequestLoginDTO request) {
        int userType = request.getUserType();
        int foundUserStatus = 0;
        String response = null;
        if (userType == UserType.CUSTOMER_ROLE_ID) {
            boolean status = customerService.customerLogin(request.getEmail(), request.getPassword());
            if (status) {
                foundUserStatus = userType;
                Customer foundCustomer = customerService.getCustomerByEmail(request.getEmail());
                if (foundCustomer.isActiveStatus()) {
                    response = tokenService.generateToken(foundCustomer);
                }
            }
        } else if (userType == UserType.SALES_STAFF_ROLE_ID) {
            boolean status = salesStaffService.salesStaffLogin(request.getEmail(), request.getPassword());
            if (status) {
                foundUserStatus = userType;
                SalesStaff foundSalesStaff = salesStaffService.getSalesStaffByEmail(request.getEmail());
                response = tokenService.generateToken(foundSalesStaff);
            }
        } else if (userType == UserType.DELIVERY_STAFF_ROLE_ID) {
            boolean status = deliveryStaffService.deliveryStaffLogin(request.getEmail(), request.getPassword());
            if (status) {
                foundUserStatus = userType;
                DeliveryStaff foundDeliveryStaff = deliveryStaffService.getDeliveryStaffByEmail(request.getEmail());
                response = tokenService.generateToken(foundDeliveryStaff);
            }
        } else if (userType == UserType.MANAGER_ROLE_ID) {
            boolean status = managerService.managerLogin(request.getEmail(), request.getPassword());
            if (status) {
                foundUserStatus = userType;
                Manager foundManager = managerService.getManagerByEmail(request.getEmail());
                response = tokenService.generateToken(foundManager);
            }
        }

        if (foundUserStatus == 0) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        return ResponseEntity.ok(response);
    }


    @GetMapping("/register")
    public RedirectView register(@RequestParam String email) {
//        return ResponseEntity.ok(customerService.customerRegister(email, password, username, phoneNumber));
        boolean result = customerService.customerConfirm(email);
        if (result) {
            try {
                return new RedirectView("http://localhost:5173/registration-success");
            } catch (Exception e) {
                return new RedirectView("http://localhost:5173/404");
            }
        } else {
            return new RedirectView("http://localhost:5173/404");
        }
    }

    @PostMapping("/register-confirmation")
    public ResponseEntity<?> registerConfirmation(@RequestBody UserRequestRegisterDTO request) {
        try {
            customerService.registrationConfirm(request);
            return ResponseEntity.ok("Registration successful. Please check your email for confirmation.");
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequestDTO request) {
        String email = request.getEmail();
        int userType = request.getUserType();
        
        EmailDetailDTO emailDetail = new EmailDetailDTO();
        if (userType == UserType.CUSTOMER_ROLE_ID) {
            Customer customer = customerService.getCustomerByEmail(email);
            if (customer != null) {
                emailDetail.setReceiver(customer);
            }
        } else if (userType == UserType.SALES_STAFF_ROLE_ID) {
            SalesStaff salesStaff = salesStaffService.getSalesStaffByEmail(email);
            if (salesStaff != null) {
                emailDetail.setReceiver(salesStaff);
            }
        } else if (userType == UserType.DELIVERY_STAFF_ROLE_ID) {
            DeliveryStaff deliveryStaff = deliveryStaffService.getDeliveryStaffByEmail(email);
            if (deliveryStaff != null) {
                emailDetail.setReceiver(deliveryStaff);
            }
        }

        if(emailDetail.getReceiver() == null){
            return ResponseEntity.ok(false);
        }
        emailDetail.setSubject("You have request a new password");
        String encodedEmail = URLEncoder.encode(email, StandardCharsets.UTF_8);
        System.out.println("Encoded email is: " + encodedEmail);
        emailDetail.setLink("http://localhost:5173/forgot-password" + "?email=" + encodedEmail + "&userType=" + userType);
        emailService.sendEmail(emailDetail, 12);
        return ResponseEntity.ok(true);
    }

    @PutMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequestDTO request) {
        String email = request.getEmail();
        int userType = request.getUserType();
        String password = request.getPassword();

        String newPassword = passwordEncoder.encode(password);
        boolean passwordUpdated = false;

        String decodedEmail = URLDecoder.decode(email, StandardCharsets.UTF_8);

        // Kiểm tra roleId và cập nhật mật khẩu tương ứng
        if (userType == UserType.CUSTOMER_ROLE_ID) {
            Customer customer = customerService.getCustomerByEmail(decodedEmail);
            if (customer != null) {
                customer.setPassword(newPassword);
                customerRepository.save(customer);
                passwordUpdated = true;
            }
        } else if (userType == UserType.SALES_STAFF_ROLE_ID) {
            SalesStaff salesStaff = salesStaffService.getSalesStaffByEmail(decodedEmail);
            if (salesStaff != null) {
                salesStaff.setPassword(newPassword);
                salesStaffRepository.save(salesStaff);
                passwordUpdated = true;
            }
        } else if (userType == UserType.DELIVERY_STAFF_ROLE_ID) {
            DeliveryStaff deliveryStaff = deliveryStaffService.getDeliveryStaffByEmail(decodedEmail);
            if (deliveryStaff != null) {
                deliveryStaff.setPassword(newPassword);
                deliveryStaffRepository.save(deliveryStaff);
                passwordUpdated = true;
            }
        }

        return ResponseEntity.ok(passwordUpdated);
    }
}
