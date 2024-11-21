package com.swp391team3.koi_delivery_ordering_system.service;

import com.swp391team3.koi_delivery_ordering_system.model.PaymentHistory;

import java.util.List;
import java.util.Optional;

public interface IPaymentHistoryService {
    List<PaymentHistory> getAllPaymentHistory();
    Optional<PaymentHistory> getPaymentHistoryById(Long id);
    PaymentHistory logPaymentHistory(double amount, Long orderId, Long customerId);
    void confirmPaymentHistory(Long customerId, double amount);
    List<PaymentHistory> getPaymentHistoryByOrder(Long orderId);
}
