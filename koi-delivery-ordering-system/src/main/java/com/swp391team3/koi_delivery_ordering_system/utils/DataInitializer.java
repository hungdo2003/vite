package com.swp391team3.koi_delivery_ordering_system.utils;

import com.swp391team3.koi_delivery_ordering_system.model.Manager;
import com.swp391team3.koi_delivery_ordering_system.model.PaymentService;
import com.swp391team3.koi_delivery_ordering_system.repository.ManagerRepository;
import com.swp391team3.koi_delivery_ordering_system.repository.PaymentServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final PaymentServiceRepository paymentServiceRepository;
    private final ManagerRepository managerRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (paymentServiceRepository.count() == 0) {
            initPaymentService();
        }

        if (managerRepository.count() == 0) {
            initManager();
        }
    }

    private void initPaymentService() {
        PaymentService servicePriceBase = new PaymentService();
        servicePriceBase.setDescription("Price Base");
        servicePriceBase.setRate(15000.0);

        PaymentService serviceFishRate = new PaymentService();
        serviceFishRate.setDescription("Price for each koi fish");
        serviceFishRate.setRate(10000.0);

        PaymentService servicePriceRateDomestic = new PaymentService();
        servicePriceRateDomestic.setDescription("Price Rate for Domestic Service");
        servicePriceRateDomestic.setRate(1.0);

        PaymentService servicePriceRateForeign = new PaymentService();
        servicePriceRateForeign.setDescription("Price Rate for Foreign Service");
        servicePriceRateForeign.setRate(1.5);

        paymentServiceRepository.save(servicePriceBase);
        paymentServiceRepository.save(serviceFishRate);

        paymentServiceRepository.save(servicePriceRateDomestic);
        paymentServiceRepository.save(servicePriceRateForeign);
    }

    private void initManager() {
        Manager newManager = new Manager();
        newManager.setEmail("admin@koiapp.com");
        newManager.setPhoneNumber("123456789");
        String encodedPassword = passwordEncoder.encode("12345678");
        newManager.setPassword(encodedPassword);
        newManager.setUsername("Root Admin");
        managerRepository.save(newManager);
    }
}
