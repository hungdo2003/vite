package com.swp391team3.koi_delivery_ordering_system.controller;

import com.swp391team3.koi_delivery_ordering_system.requestDto.OrderDeliveringInfoRequestDTO;
import com.swp391team3.koi_delivery_ordering_system.requestDto.OrderDeliveringUpdateInfoRequestDTO;
import com.swp391team3.koi_delivery_ordering_system.service.IOrderDeliveringService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/order-delivering")
@RequiredArgsConstructor
public class OrderDeliveringController {
    private final IOrderDeliveringService orderDeliveringService;

    @PreAuthorize("hasAuthority('DeliveryStaff')")
    @PostMapping("/start-getting")
    public ResponseEntity<?> startGetting(@RequestBody OrderDeliveringInfoRequestDTO request) {
        boolean createOrderDelivering = orderDeliveringService.startGetting(request.getOrderId(), request.getDeliveryStaffId());
        return ResponseEntity.ok(createOrderDelivering);
    }

    @PreAuthorize("hasAuthority('DeliveryStaff')")
    @PutMapping("/updateOrderDeliveringLocation")
    public ResponseEntity<?> updateOrderDeliveringLocation(@RequestBody OrderDeliveringUpdateInfoRequestDTO request) {
        return ResponseEntity.ok(orderDeliveringService.updateDeliveringInfo(request));
    }

    @PreAuthorize("hasAuthority('DeliveryStaff')")
    @PostMapping("/start-delivering")
    public ResponseEntity<?> startDelivering(@RequestBody OrderDeliveringInfoRequestDTO request) {
        boolean createOrderDelivering = orderDeliveringService.startDelivering(request.getOrderId(), request.getDeliveryStaffId());
        return ResponseEntity.ok(createOrderDelivering);
    }
}
