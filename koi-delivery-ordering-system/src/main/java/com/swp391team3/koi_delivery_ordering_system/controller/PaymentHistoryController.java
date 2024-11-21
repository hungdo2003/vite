package com.swp391team3.koi_delivery_ordering_system.controller;

import com.swp391team3.koi_delivery_ordering_system.requestDto.PaymentRequestDTO;
import com.swp391team3.koi_delivery_ordering_system.service.IPaymentHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/payment-history")
@RequiredArgsConstructor
public class PaymentHistoryController {
    private final IPaymentHistoryService paymentHistoryService;

    @PreAuthorize("hasAuthority('Customer')")
    @PostMapping("/log-payment-history")
    public ResponseEntity<?> logPayment(@RequestBody PaymentRequestDTO request) {
        return ResponseEntity.ok(paymentHistoryService.logPaymentHistory(request.getAmount(), request.getOrderId(), request.getCustomerId()));
    }

    @PreAuthorize("hasAuthority('Customer')")
    @GetMapping("/get-payment-history/{id}")
    public ResponseEntity<?> checkPayment(@PathVariable Long id) {
        return ResponseEntity.ok(paymentHistoryService.getPaymentHistoryById(id).get());
    }

    @PreAuthorize("hasAuthority('Manager')")
    @GetMapping("/get-all-payment-history")
    public ResponseEntity<?> getAllPaymentHistory() {
        return ResponseEntity.ok(paymentHistoryService.getAllPaymentHistory());
    }

    @PreAuthorize("hasAuthority('Customer')")
    @GetMapping("/get-payment-history-by-order-id/{orderId}")
    public ResponseEntity<?> getTracsactionsByOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(paymentHistoryService.getPaymentHistoryByOrder(orderId));
    }
}
