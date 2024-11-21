package com.swp391team3.koi_delivery_ordering_system.service;

import com.swp391team3.koi_delivery_ordering_system.model.Customer;
import com.swp391team3.koi_delivery_ordering_system.model.Order;
import com.swp391team3.koi_delivery_ordering_system.model.PaymentHistory;
import com.swp391team3.koi_delivery_ordering_system.repository.CustomerRepository;
import com.swp391team3.koi_delivery_ordering_system.repository.OrderRepository;
import com.swp391team3.koi_delivery_ordering_system.repository.PaymentHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentHistoryServiceImpl implements IPaymentHistoryService {
    private final PaymentHistoryRepository paymentHistoryRepository;
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;

    @Override
    public List<PaymentHistory> getAllPaymentHistory() {
        return paymentHistoryRepository.findAll();
    }

    @Override
    public Optional<PaymentHistory> getPaymentHistoryById(Long id) {
        return paymentHistoryRepository.findById(id);
    }

    @Override
    public PaymentHistory logPaymentHistory(double amount, Long orderId, Long customerId) {
        Optional<Order> order = orderRepository.findById(orderId);
//        Optional<PaymentHistory> checkPaymentExist = paymentHistoryRepository.checkExistPaymentHistory(order.get().getId());
//        if (checkPaymentExist.isPresent()) {
//            return checkPaymentExist.get(); //return if exist to avoid error;
//        }
        PaymentHistory paymentHistory = new PaymentHistory();
        paymentHistory.setAmount(amount);
        Optional<Customer> customer = customerRepository.findById(customerId);
        paymentHistory.setCustomer(customer.get());
        paymentHistory.setOrder(order.get());
        paymentHistory.setPaymentStatus(false);
        paymentHistoryRepository.save(paymentHistory);
        return paymentHistory;
    }

    @Override
    public void confirmPaymentHistory(Long customerId, double amount) {
        List<PaymentHistory> orderPaymentHistories = paymentHistoryRepository
                .findPaymentHistoriesByCustomerIdAndAmount(
                        customerId, amount);
        PaymentHistory foundPaymentHistory = orderPaymentHistories.get(0);
        foundPaymentHistory.setPaymentStatus(true);
        paymentHistoryRepository.save(foundPaymentHistory);
    }

    @Override
    public List<PaymentHistory> getPaymentHistoryByOrder(Long orderId) {
        return paymentHistoryRepository.getPaymentHistoryByOrderId(orderId);
    }
}
