package com.swp391team3.koi_delivery_ordering_system.service;

import com.swp391team3.koi_delivery_ordering_system.responseDto.PaymentResponseDTO;
import jakarta.servlet.http.HttpServletRequest;

public interface IPaymentService {
    PaymentResponseDTO createVnPayPayment(HttpServletRequest request, Long customerId);
}
