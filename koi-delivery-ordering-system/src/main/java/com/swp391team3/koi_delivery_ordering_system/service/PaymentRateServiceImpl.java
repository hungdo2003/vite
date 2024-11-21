package com.swp391team3.koi_delivery_ordering_system.service;

import com.swp391team3.koi_delivery_ordering_system.model.PaymentService;
import com.swp391team3.koi_delivery_ordering_system.repository.PaymentServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentRateServiceImpl implements IPaymentRateService {
    private final PaymentServiceRepository paymentServiceRepository;

    @Override
    public List<PaymentService> getAllPaymentInfo() {
        return paymentServiceRepository.findAll();
    }

    @Override
    public boolean updatePaymentServiceRate(Long id, double rate) {
        Optional<PaymentService> foundPaymentService = getPaymentServiceById(id);
        Map<Long, Double> minRates = Map.of(
                1L, 15000.0,
                2L, 10000.0,
                3L, 1.0,
                4L, 1.5
        );

        // Check if the payment service is present and the rate is positive
        if (foundPaymentService.isPresent() && rate > 0) {
            // Get the minimum rate required for the given id, default to Double.MAX_VALUE if id not found
            double minRate = minRates.getOrDefault(id, Double.MAX_VALUE);
            System.out.println("Rate is " +rate);
            System.out.println(minRate);
            // Validate the rate against the minimum required rate
            if (rate >= minRate) {
                PaymentService paymentService = foundPaymentService.get();
                paymentService.setRate(rate);
                paymentServiceRepository.save(paymentService);
                return true;
            }
        }

        return false;
    }

    @Override
    public Optional<PaymentService> getPaymentServiceById(Long id) {
        return paymentServiceRepository.findById(id);
    }
}
