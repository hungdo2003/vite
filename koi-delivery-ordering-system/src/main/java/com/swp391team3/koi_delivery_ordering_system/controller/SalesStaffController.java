package com.swp391team3.koi_delivery_ordering_system.controller;

import com.swp391team3.koi_delivery_ordering_system.exception.ValidationException;
import com.swp391team3.koi_delivery_ordering_system.model.SalesStaff;
import com.swp391team3.koi_delivery_ordering_system.requestDto.StaffRequestCreationDTO;
import com.swp391team3.koi_delivery_ordering_system.requestDto.StaffRequestUpdateDTO;
import com.swp391team3.koi_delivery_ordering_system.requestDto.UserUpdateRequestDTO;
import com.swp391team3.koi_delivery_ordering_system.service.ISalesStaffService;

import java.io.IOException;
import java.util.Optional;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("api/salesStaff")
@RequiredArgsConstructor
public class SalesStaffController {
    private final ISalesStaffService salesStaffService;

    @PreAuthorize("hasAuthority('Manager')")
    @PostMapping("/createSalesStaff")
    public ResponseEntity<?> createSalesStaff(@RequestBody StaffRequestCreationDTO request) {
        try {
            String result = salesStaffService.createSalesStaff(request.getEmail(), request.getUsername(), request.getPhoneNumber());
            return ResponseEntity.ok(result);
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //Get All Sales Staff
    //PASSED
    @PreAuthorize("hasAuthority('Manager')")
    @GetMapping("/getAllSalesStaff")
    public ResponseEntity<?> getAllSalesStaff() {
        return ResponseEntity.ok(salesStaffService.getAllSalesStaff());
    }

    //Get Sale Staff By Id
    //PASSED
    @PreAuthorize("hasAuthority('SalesStaff')")
    @GetMapping("/getSalesStaffById/{id}")
    public ResponseEntity<?> getSalesStaffById(@PathVariable Long id) {
        return ResponseEntity.ok(salesStaffService.getSalesStaffById(id));
    }

    //UPDATE SALES STAFF
    //PASSED
    @PreAuthorize("hasAuthority('SalesStaff') or hasAuthority('Manager')")
    @PutMapping("/updateSalesStaffById/{id}")
    public ResponseEntity<?> updateSalesStaff(@PathVariable Long id, @RequestBody StaffRequestUpdateDTO salesStaff) {
        try {
            SalesStaff salesStaff1 = salesStaffService.updateSalesStaff(id, salesStaff.getUsername(), salesStaff.getEmail(), salesStaff.getPhoneNumber());
            return ResponseEntity.ok(salesStaff1);
        }catch (ValidationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('SalesStaff')or hasAuthority('Manager')")
    @PutMapping("/updateSalesStaffProfile")
    public ResponseEntity<?> updateSalesStaffProfile(@RequestBody UserUpdateRequestDTO request) {
        try {
            String result = salesStaffService.salesStaffUpdateProfile(request);
            return ResponseEntity.ok(result);
        }catch (ValidationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('SalesStaff')")
    @PutMapping("/updateSalesStaffAvatar/{id}")
    public ResponseEntity<?> updateSalesStaffProfileAvatar(
            @PathVariable("id") Long id,
            @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(salesStaffService.salesStaffUpdateAvatar(id, file));
    }

    @PreAuthorize("hasAuthority('Manager')")
    @PutMapping("/disable/{id}")
    public ResponseEntity<?> disableSalesStaffById(@PathVariable Long id) {
        Optional<SalesStaff> salesStaff = salesStaffService.getSalesStaffById(id);
        if (salesStaff.isPresent()) {
            salesStaffService.disableSalesStaffById(id);
            return ResponseEntity.status(HttpStatus.OK).body("Disabled sales staff with id: " + id + " successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PreAuthorize("hasAuthority('Manager')")
    @PutMapping("/enable/{id}")
    public ResponseEntity<?> enableSalesStaffSalesStaffById(@PathVariable Long id) {
        Optional<SalesStaff> salesStaff = salesStaffService.getSalesStaffById(id);
        if (salesStaff.isPresent()) {
            salesStaffService.enableSalesStaffById(id);
            return ResponseEntity.status(HttpStatus.OK).body("Enabled sales staff with id: " + id + " successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
