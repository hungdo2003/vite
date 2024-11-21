package com.swp391team3.koi_delivery_ordering_system.repository;

import com.swp391team3.koi_delivery_ordering_system.model.PaymentHistory;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PaymentHistoryRepository extends JpaRepository<PaymentHistory, Long> {
    @Query("SELECT ph FROM PaymentHistory ph WHERE ph.customer.id = :customerId AND ph.amount = :amount ORDER BY ph.id DESC")
    List<PaymentHistory> findPaymentHistoriesByCustomerIdAndAmount(Long customerId, double amount);

//    @Query("SELECT ph FROM PaymentHistory ph WHERE ph.order.id = :orderId")
//    Optional<PaymentHistory> checkExistPaymentHistory(Long orderId);

    @Query("SELECT ph FROM PaymentHistory ph WHERE ph.order.id = :orderId AND ph.paymentStatus = true")
    List<PaymentHistory> getPaymentHistoryByOrderId(Long orderId);
}
