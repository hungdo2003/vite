package com.swp391team3.koi_delivery_ordering_system.service;

import com.swp391team3.koi_delivery_ordering_system.model.PaymentService;

import java.util.List;
import java.util.Optional;

public interface IPaymentRateService {
    List<PaymentService> getAllPaymentInfo();
    boolean updatePaymentServiceRate(Long id, double rate);
    Optional<PaymentService> getPaymentServiceById(Long id);
}
